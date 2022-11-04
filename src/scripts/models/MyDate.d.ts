/**
 * Extended Built-in Date
 * @class MyDate
 * @classdesc An custom date extends built in date
 * @augments {Date}
 */
export default class MyDate extends Date {
    /**
     * Add days from the current date.
     * `Creating new MyDate instance`
     */
    addDays(days: number): MyDate;

    /**
     * Add months from the current date.
     * `Creating new MyDate instance`
     */
    addMonths(months: number): MyDate;
}