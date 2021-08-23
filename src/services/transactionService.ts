import { getDailyBalanceFormat } from "../utils/formattingUtils";
import { ServiceId } from "./serviceContainer";
const fetch = require("node-fetch");

export interface PageContent {
    totalCount: number;
    page: number;
    transactions: Transaction[];
}

export interface Transaction {
    Date: string;
    Ledger: string;
    Amount: string;
    Company: string;
}

export abstract class TransactionService {
    static readonly id: ServiceId<TransactionService> = { id: TransactionService.name };

    abstract fetchAllTransactions(): Promise<Transaction[]>;

    abstract calculateDailyBalances(transactions: Transaction[]): string;

    abstract getPageContent(page: number): Promise<PageContent>;
}

const MAX_PAGES = 100;
export class TransactionServiceImpl implements TransactionService {

    calculateDailyBalances(transactions: Transaction[]): string { 
        let dailyBalances = new Map(); // (date, sum)
        transactions.forEach( (transaction: Transaction) => {
            let date: string = transaction.Date;
            let amount: number = parseFloat(transaction.Amount);
            if (dailyBalances.has(date)) {
                amount += dailyBalances.get(date);
            }

            dailyBalances.set(date, amount);
        });

        // format the result and limit the number to 2 decimal places
        let result: string = "";
        dailyBalances.forEach((total: number, date: string) => {
            result = result.concat(getDailyBalanceFormat(date, total));
        });

        return result;
    }

    async fetchAllTransactions(): Promise<Transaction[]> {
        let page = 1; // start page
        let totalTransactionCount: number = (await this.getPageContent(page)).totalCount;

        let fetchedTransactions: Transaction[] = [];
        while (fetchedTransactions.length < totalTransactionCount) {
            let pageContent: PageContent = await this.getPageContent(page);
            fetchedTransactions = fetchedTransactions.concat(pageContent.transactions);
            
            if (page >= MAX_PAGES) {
                return Promise.reject(new Error("Page limit exceeded"));
            }
            page++;
        }

        return fetchedTransactions;
    }

    async getPageContent(page: number): Promise<PageContent> {
        const response = await fetch(`https://resttest.bench.co/transactions/${page}.json`, { method: 'GET' });
        if (response.ok) {
            return (await response.json());
        }

        return Promise.reject(new Error(`${response.statusText}`));
    }
}