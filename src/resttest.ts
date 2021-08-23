import { getService, initServices } from "./services/serviceContainer";
import { TransactionService } from "./services/transactionService";

(async () => await activate())();

async function activate() {
    initServices();
    console.log("Fetching daily balances. . .");
    try {
        let transactions = await getService(TransactionService.id).fetchAllTransactions();
        let balances = getService(TransactionService.id).calculateDailyBalances(transactions);
        console.log("------------ DAILY BALANCES ------------");
        console.log(balances);
        console.log("----------------------------------------");
    } catch (error) {
        console.log(`Whoops! Looks like there has been a glitch in the Matrix :(`);
    }
}