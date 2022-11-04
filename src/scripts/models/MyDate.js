/**
 * Extended Built-in Date
 */
export default class MyDate extends Date {
    /**
     * Add days from the current date.
     * `Creating new MyDate instance`
     * @param {number} days how many days
     * @returns
     */
    addDays(days) {
        let date = new MyDate(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    /**
     * Add months from the current date.
     * `Creating new MyDate instance`
     * @param {number} months how many months
     * @returns
     */
    addMonths(months) {
        let date = new MyDate(this.valueOf());
        date.setMonth(date.getMonth() + Number(months));
        return date;
    }
}
