/**
 * @param date - the date of transaction
 * @param total - transaction amount
 * @returns the correct daily balance format for printing
 */
export function getDailyBalanceFormat(date: string, total: number) {
    return `${date} | ${total.toFixed(2)}\n`;
}