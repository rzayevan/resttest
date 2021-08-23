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

/**
 * This service contains operations related to Transactions API
 * https://resttest.bench.co/transactions/
 */
export abstract class TransactionService {
    static readonly id: ServiceId<TransactionService> = { id: TransactionService.name };

    /**
     * Fetches transactions across all pages
     * @returns transactions if successful, error if page limit has exceeded
     */
    abstract fetchAllTransactions(): Promise<Transaction[]>;

    /**
     * Calculates total amounts for each date
     * @param transactions - transactions that need to be parsed
     * @returns a string in "date | total amount" format if successful, an error otherwise
     */
    abstract calculateDailyBalances(transactions: Transaction[]): string;

    /**
     * Fetches the content of the page specified from Transactions API
     * @param page - the name of the page that will be fetched
     */
    abstract getPageContent(page: number): Promise<PageContent>;
}

const MAX_PAGES = 100;
export class TransactionServiceImpl implements TransactionService {

    calculateDailyBalances(transactions: Transaction[]): string { 
        let dailyBalances = new Map(); // format -> (date, total amount)

        // calculate total amounts for each date and add them to the map
        transactions.forEach( (transaction: Transaction) => {
            let date: string = transaction.Date;
            let amount: number = parseFloat(transaction.Amount);
            if (Number.isNaN(amount)) {
                throw new Error("Invalid amount format");
            }

            if (dailyBalances.has(date)) {
                amount += dailyBalances.get(date);
                if (!Number.isFinite(amount)) {
                    throw new Error("Balance too large to display");
                }
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

        // keep parsing pages until all transactions have been fetched
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