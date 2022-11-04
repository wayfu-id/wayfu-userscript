import { elemenOptions } from "./../lib/HtmlModifier";

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 */
export default class Waydown {
    src: string;
    rgx: {
        lt: RegExp;
        gt: RegExp;
        escape: RegExp;
        format: RegExp;
        link: RegExp;
        para: RegExp;
    };
    plain: boolean;

    /** Create HTML elemenet and return it's `outerHTML` value */
    #element(tag: string, content: string, opt?: elemenOptions): string;

    /** Get `raw` string from input content */
    #raw(content: string): string;

    /** Set HMTL tag highlighter to input content */
    #highlight(content: string): string;

    /** Chreate link element upon every `link like` string  */
    #link(): Waydown;

    /** Create paragraph element upon every paragraph string */
    #paragraph(): Waydown;

    /** Trim string source */
    #trim(): string;

    /** Convert formated text to HTML string */
    toHtml(source: string, plain?: boolean): string;
}
export const waydown: Waydown;