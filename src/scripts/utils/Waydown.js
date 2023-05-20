// import { DOM } from "../lib/HtmlModifier";
import DOM from "./DOM";

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 */
export default class Waydown {
    constructor(source, plain = false) {
        this.src = `${source}`.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.rgx = {
            para: /(?=^|\n)(\s+)*([^<]+?)[\n\s]*(?=<|\n|$)/g,
        };
        this.plain = plain;
    }

    /**
     * Create HTML elemenet and return it's `outerHTML` value
     * @param {string} tag
     * @param {string} content
     * @param {import("./DOM").elemenOptions} opt
     * @returns
     */
    element(tag, content, opt = {}) {
        let props = Object.assign({ tag, html: content }, opt);
        // const elm = DOM.createElement(
        //     Object.assign({ tag: tag, html: content }, opt)
        // );
        // const elm = DOM.create(
        //     Object.assign({ tag, html: content }, opt)
        // ).first;
        return DOM.create(props).first.outerHTML;
    }

    /**
     * Get `raw` string from input content
     * @param {string} content
     * @returns
     */
    raw(content) {
        let rgx = /\\([\\\|`*_{}\[\]()#+\-~])/g;
        return this.highlight(content).replace(rgx, "$1");
    }

    /**
     * Set HMTL tag highlighter to input content
     * @param {string} content
     * @returns {string}
     */
    highlight(content) {
        if (this.plain) return content;

        return content.replace(
            /(^|[^A-Za-z\d\\])(([*])|(_)|(~)|`)(\2?)([^<]*?)\2\6(?!\2)(?=\W|_|$)/g,
            (all, _, p1, bold, italic, strike, mono, content) => {
                const tag = ((b, i, s, c) => {
                    return c ? "code" : b ? "strong" : i ? "em" : s ? "s" : "";
                })(bold, italic, strike, mono);

                const newContent = (mono) => {
                    return this.highlight(
                        mono ? content.replace(/`/g, "") : content
                    );
                };

                return `${_}${this.element(tag, newContent(mono))}`;
            }
        );
    }

    /** Chreate link element upon every `link like` string */
    link() {
        let rgx =
            /(?:(http(?:s)?)?:\/\/)?((?:([a-z\d-]+?)\.([\.a-z]{2,}?))|((?:[\.\d]{1,3}?){4}?))(\:\d+)?((?:\/[-a-z\d%_.~+]*?)*?)(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?(?=$|\s|\n|<)/gi;

        this.src = this.src.replace(rgx, (m, ...g) => {
            let [proc, domain] = g;
            return this.element("a", m, {
                href: m,
                title: domain,
                alt: domain,
                target: "_blank",
            });
        });

        return this;
    }

    /** Create paragraph element upon every paragraph string */
    paragraph() {
        let rgx = /(?=^|\n)(\s+)*([^<]+?)[\n\s]*(?=<|\n|$)/g;

        this.src = this.src.replace(rgx, (all, _, content) => {
            _ = _ ? _.replace(/\n/, "<br/>") : "";
            return `${_}${this.element("div", this.raw(content))}`;
        });

        return this;
    }

    /** Trim string source */
    trim() {
        this.src = this.src.trim();
        return this.src;
    }

    /**
     * Convert formated text to HTML string
     * @param {string} source
     * @param {boolean} plain
     * @returns {string}
     */
    static toHtml(source, plain = false) {
        return new Waydown(source, plain).paragraph().link().trim();
    }
}
