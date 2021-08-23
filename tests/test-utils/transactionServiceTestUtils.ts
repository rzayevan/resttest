import { Transaction } from "../../src/services/transactionService"
import { getDailyBalanceFormat } from "../../src/utils/formattingUtils";

export function generateMixedTransactions(): Transaction[] {

    return [
        { Date: "2012-12-12", Amount: "-25.51", Company: "Company 1", Ledger: "Expense"},
        { Date: "2012-12-12", Amount: "5", Company: "Payment", Ledger: ""},
        { Date: "2012-12-12", Amount: "-5.51", Company: "Company 2", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-25", Company: "Company 3", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-15.58686", Company: "Company 4", Ledger: "Expense"},
        { Date: "2012-12-14", Amount: "-100000.50595", Company: "Company 5", Ledger: "Expense"}
    ];
}

export function getMixedExpectedDailyBalance(): string {
    let expected = "";
    expected = expected.concat(getDailyBalanceFormat("2012-12-12", -26.02));
    expected = expected.concat(getDailyBalanceFormat("2012-12-13", -40.59));
    expected = expected.concat(getDailyBalanceFormat("2012-12-14", -100000.51));
    return expected;
}

export function generateFloatOnlyTransactions(): Transaction[] {

    return [
        { Date: "2012-12-12", Amount: "-25.51", Company: "Company 1", Ledger: "Expense"},
        { Date: "2012-12-12", Amount: "25.51", Company: "Payment", Ledger: ""},
        { Date: "2012-12-12", Amount: "-5.51", Company: "Company 2", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-25.51", Company: "Company 3", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-15.25", Company: "Company 4", Ledger: "Expense"},
        { Date: "2012-12-14", Amount: "-100000.256879", Company: "Company 5", Ledger: "Expense"}
    ];
}

export function getFloatOnlyExpectedDailyBalance(): string {
    let expected = "";
    expected = expected.concat(getDailyBalanceFormat("2012-12-12", -5.51));
    expected = expected.concat(getDailyBalanceFormat("2012-12-13", -40.76));
    expected = expected.concat(getDailyBalanceFormat("2012-12-14", -100000.26));
    return expected;
}

export function generateIntegerOnlyTransactions(): Transaction[] {

    return [
        { Date: "2012-12-12", Amount: "-5", Company: "Company 1", Ledger: "Expense"},
        { Date: "2012-12-12", Amount: "2", Company: "Payment", Ledger: ""},
        { Date: "2012-12-12", Amount: "-50", Company: "Company 2", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-25", Company: "Company 3", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: "-15", Company: "Company 4", Ledger: "Expense"},
        { Date: "2012-12-14", Amount: "-100000", Company: "Company 5", Ledger: "Expense"}
    ];
}

export function getIntegerOnlyExpectedDailyBalance(): string {
    let expected = "";
    expected = expected.concat(getDailyBalanceFormat("2012-12-12", -53));
    expected = expected.concat(getDailyBalanceFormat("2012-12-13", -40));
    expected = expected.concat(getDailyBalanceFormat("2012-12-14", -100000));
    return expected;
}

export function generateInvalidTransactions(): Transaction[] {

    return [
        { Date: "2012-12-12", Amount: `${Number.MAX_VALUE}`, Company: "Company 1", Ledger: "Expense"},
        { Date: "2012-12-13", Amount: `${Number.MAX_VALUE}`, Company: "Payment", Ledger: ""},
        { Date: "2012-12-14", Amount: "-100000", Company: "Company 5", Ledger: "Expense"}
    ];
}