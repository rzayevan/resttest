export function getDailyBalanceFormat(date: string, total: number) {
    return `${date} | ${total.toFixed(2)}\n`;
}