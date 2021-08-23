import { getService, initServices } from "../src/services/serviceContainer";
import { PageContent, Transaction, TransactionService } from "../src/services/transactionService";
import { generateFloatOnlyTransactions, generateIntegerOnlyTransactions, getMixedExpectedDailyBalance, getFloatOnlyExpectedDailyBalance, getIntegerOnlyExpectedDailyBalance, generateMixedTransactions, generateInvalidTransactions, generateHugeTransactions } from "./test-utils/transactionServiceTestUtils";

describe("Transaction Service tests", () => {
    initServices();

    it("Fetching a valid page number", async () => {
        let pageContent: PageContent = await getService(TransactionService.id).getPageContent(1);
        expect(pageContent).toBeDefined();
        expect(pageContent.page).toEqual(1);
        expect(pageContent.totalCount).toBeGreaterThanOrEqual(1);

        let mockTransaction: Transaction = {
            Amount: "-110.71",
            Date: "2013-12-22",
            Company: "SHAW CABLESYSTEMS CALGARY AB",
            Ledger: "Phone & Internet Expense"
        };
        expect(pageContent.transactions[0]).toMatchObject(mockTransaction);
    });

    it("Fetching an invalid page number", async () => {
        let pageContent = getService(TransactionService.id).getPageContent(100);
        await expect(pageContent).rejects.toThrowError();
    });

    it("Fetching multiple transactions", async () => {
        let transactions: Transaction[] = await getService(TransactionService.id).fetchAllTransactions();
        expect(transactions).toBeDefined();
        expect(transactions.length).toBeGreaterThan(0);
    });

    it("Calculating daily balances; Float Only", async () => {
        let transactions: Transaction[] = generateFloatOnlyTransactions();
        let expectedDailyBalance: string = getFloatOnlyExpectedDailyBalance();
        let calculatedDailyBalance = getService(TransactionService.id).calculateDailyBalances(transactions);
        expect(calculatedDailyBalance).toBeDefined();
        expect(calculatedDailyBalance).toEqual(expectedDailyBalance);
    });

    it("Calculating daily balances; Integer Only", async () => {
        let transactions: Transaction[] = generateIntegerOnlyTransactions();
        let expectedDailyBalance: string = getIntegerOnlyExpectedDailyBalance();
        let calculatedDailyBalance = getService(TransactionService.id).calculateDailyBalances(transactions);
        expect(calculatedDailyBalance).toBeDefined();
        expect(calculatedDailyBalance).toEqual(expectedDailyBalance);
    });

    it("Calculating daily balances; Integer and Floats", async () => {
        let transactions: Transaction[] = generateMixedTransactions();
        let expectedDailyBalance: string = getMixedExpectedDailyBalance();
        let calculatedDailyBalance = getService(TransactionService.id).calculateDailyBalances(transactions);
        expect(calculatedDailyBalance).toBeDefined();
        expect(calculatedDailyBalance).toEqual(expectedDailyBalance);
    });

    it("Calculating daily balances; Really big numbers", async () => {
        let transactions: Transaction[] = generateHugeTransactions();
        expect(() => {
            getService(TransactionService.id).calculateDailyBalances(transactions)
        }).toThrow('Balance too large to display');
    });

    it("Calculating daily balances; Invalid number format", async () => {
        let transactions: Transaction[] = generateInvalidTransactions();
        expect(() => {
            getService(TransactionService.id).calculateDailyBalances(transactions)
          }).toThrow('Invalid amount format');
    });
});