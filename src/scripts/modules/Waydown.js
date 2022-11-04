import { DOM } from "../lib/HtmlModifier";

/**
 * Waydown : A WhatsApp markdown/Format decoder
 *
 * Inspired by Drawdown (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 */
class Waydown {
    constructor() {
        this.src = "";
        this.rgx = {
            lt: /</g,
            gt: />/g,
            escape: /\\([\\\|`*_{}\[\]()#+\-~])/g,
            format: /(^|[^A-Za-z\d\\])(([*])|(_)|(~)|`)(\2?)([^<]*?)\2\6(?!\2)(?=\W|_|$)/g,
            link: /(?:(http(?:s)?)?:\/\/)?((?:([a-z\d-]+?)\.([\.a-z]{2,}?))|((?:[\.\d]{1,3}?){4}?))(\:\d+)?((?:\/[-a-z\d%_.~+]*?)*?)(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?(?=$|\s|\n|<)/gi,
            para: /(?=^|\n)(\s+)*([^<]+?)[\n\s]*(?=<|\n|$)/g,
        };
        this.plain = false;
    }

    /**
     * Create HTML elemenet and return it's `outerHTML` value
     * @param {string} tag
     * @param {string} content
     * @param {import("./../lib/HtmlModifier").elemenOptions} opt
     * @returns
     */
    #element(tag, content, opt = {}) {
        const elm = DOM.createElement(Object.assign({ tag: tag, html: content }, opt));
        return elm.outerHTML;
    }

    /**
     * Get `raw` string from input content
     * @param {string} content
     * @returns
     */
    #raw(content) {
        return content.replace(this.rgx.escape, "$1");
    }

    /**
     * Set HMTL tag highlighter to input content
     * @param {string} content
     * @returns {string}
     */
    #highlight(content) {
        let { format: hg } = this.rgx;
        return !this.plain
            ? content.replace(hg, (all, _, p1, bold, italic, strike, mono, content) => {
                  const tag = ((b, i, s, c) => {
                      return c ? "code" : b ? "strong" : i ? "em" : s ? "s" : "";
                  })(bold, italic, strike, mono);

                  content = mono ? content.replace(/`/g, "") : content;
                  return `${_}${this.#element(tag, this.#highlight(content))}`;
              })
            : content;
    }

    /** Chreate link element upon every `link like` string */
    #link() {
        let { link } = this.rgx;
        this.src = this.src.replace(link, (m, ...g) => {
            let [proc, domain] = g;
            return this.#element("a", m, {
                href: m,
                title: domain,
                alt: domain,
                target: "_blank",
            });
        });

        return this;
    }

    /** Create paragraph element upon every paragraph string */
    #paragraph() {
        let { para } = this.rgx;
        this.src = this.src.replace(para, (all, _, content) => {
            _ = _ ? _.replace(/\n/, "<br/>") : "";
            return `${_}${this.#element("div", this.#raw(this.#highlight(content)))}`;
        });

        return this;
    }

    /** Trim string source */
    #trim() {
        this.src = this.src.trim();
        return this.src;
    }

    /**
     * Convert formated text to HTML string
     * @param {string} source
     * @param {boolean} plain
     * @returns {string}
     */
    toHtml(source, plain = false) {
        const { lt, gt } = this.rgx;

        this.src = `${source}`;
        this.plain = plain;

        this.src = this.src.replace(lt, "&lt;").replace(gt, "&gt;");

        return this.#paragraph().#link().#trim();
    }
}

const waydown = new Waydown();

export { Waydown as default, waydown };
