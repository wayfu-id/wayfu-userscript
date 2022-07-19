/**
 * drawdown.js
 * (c) Adam Leggett
 * https://github.com/adamvleggett/drawdown
 */

class Drawdown {
    constructor() {
        this.src = "";
        this.rgx = {
            lt: /</g,
            gt: />/g,
            space: /\t|\r|\uf8ff/g,
            escape: /\\([\\\|`*_{}\[\]()#+\-~])/g,
            hr: /^([*\-=_] *){3,}$/gm,
            blockquote: /\n *&gt; *([^]*?)(?=(\n|$){2})/g,
            list: /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g,
            listjoin: /<\/(ol|ul)>\n\n<\1>/g,
            highlight:
                /(^|[^A-Za-z\d\\])(([*])|(_)|(~)|`)(\2?)([^<]*?)\2\6(?!\2)(?=\W|_|$)/g,
            link: /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g,
            table: /\n(( *\|.*?\| *\n)+)/g,
            thead: /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/,
            row: /.*\n/g,
            cell: /\||(.*?[^\\])\|/g,
            heading: /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g,
            para: /(?=^|>|\n)\s*\n+([^<]+?)\n*\s*(?=\n|<|$)/g,
            stash: /-\d+\uf8ff/g,
        };
        this.plain = false;
        this.stash = [];
        this.si = 0;
    }

    element(tag, content) {
        return `<${tag}>${content}</${tag}>`;
    }

    raw(content) {
        return content.replace(this.rgx.escape, "$1");
    }

    highlight(content) {
        let { highlight: hg } = this.rgx;
        return !this.plain
            ? content.replace(hg, (all, _, p1, bold, italic, strike, mono, content) => {
                  const tag = ((b, i, s, c) => {
                      return c ? "code" : b ? "strong" : i ? "em" : s ? "s" : "";
                  })(bold, italic, strike, mono);

                  content = mono ? content.replace(/`/g, "") : content;
                  return `${_}${this.element(tag, this.highlight(content))}`;
              })
            : content;
    }

    heading() {
        let { heading: hd } = this.rgx;
        this.src = this.src.replace(hd, (all, _, p1, p2) => {
            return `${_}${this.element(`h${p1.length}`, this.raw(this.highlight(p2)))}`;
        });

        return this;
    }

    paragraph() {
        let { para } = this.rgx;
        this.src = this.src.replace(para, (all, content) => {
            return `${this.element("div", this.raw(this.highlight(content)))}`;
        });

        return this;
    }

    blockquote() {
        let { blockquote: quote } = this.rgx;
        this.src = this.src.replace(quote, (all, content) => {
            return this.element(
                "blockquote",
                this.blockquote(this.highlight(content.replace(/^ *&gt; */gm, "")))
            );
        });

        return this;
    }

    link() {
        let { link } = this.rgx;
        this.src = this.src.replace(link, (all, p1, p2, p3, p4, p5, p6) => {
            this.stash[--this.si] = p4
                ? p2
                    ? `<img src="${p4}" alt="${p3}"/>`
                    : `<a href="${p4}">${this.raw(this.highlight(p3))}</a>`
                : p6;
            return this.si + "\uf8ff";
        });

        return this;
    }

    list() {
        let { list } = this.rgx;
        this.src = this.src.replace(list, (all, ind, ol, num, low, content) => {
            let rgx = RegExp("\n ?" + ind + "(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +", "g");
            let entry = this.element(
                "li",
                this.highlight(content.split(rgx).map(this.list).join("</li><li>"))
            );

            let listElement = ((ol, num, low, entry) => {
                if (!ol) {
                    return this.element("ul", entry);
                } else {
                    let numb = num ? ol : parseInt(ol, 36) - 9,
                        isLow = low ? "low" : "upp",
                        style = num ? "" : `list-style-type:${isLow} er-alpha`;

                    return `<ol start="${numb}" style="${style}">${entry}</ol>`;
                }
            })(ol, num, low, entry);

            return `\n ${listElement}`;
        });

        return this;
    }

    table() {
        const { table, thead, row, cell } = this.rgx;
        this.src = this.src.replace(table, (all, tab) => {
            let sep = tab.match(thead)[1];
            let entries = ((tab) => {
                let rows = (ro, ri) => {
                    if (ro == sep) return "";
                    let cells = (all, ce, ci) => {
                        if (!ci) return "";
                        let tag = sep && !ri ? "th" : "td";
                        return this.element(tag, this.raw(this.highlight(ce || "")));
                    };

                    return this.element("tr", ro.replace(cell, cells));
                };

                return tab.replace(row, rows);
            })(tab);

            return `\n ${this.element("table", entries)}`;
        });

        return this;
    }

    getStash() {
        const { stash } = this.rgx;
        this.src = this.src.replace(stash, (all) => {
            return this.stash[parseInt(all)];
        });

        return this;
    }

    trim() {
        this.src = this.src.trim();
        return this.src;
    }

    toHtml(source, plain = false) {
        const { lt, gt, space, hr, listjoin } = this.rgx;

        this.src = `\n${source}\n`;
        this.stash = [];
        this.si = 0;
        this.plain = plain;

        this.src = this.src
            .replace(lt, "&lt;")
            .replace(gt, "&gt;")
            .replace(space, "  ")
            .replace(hr, "<hr/>")
            .replace(listjoin, "");

        return this.blockquote()
            .list()
            .link()
            .table()
            .heading()
            .paragraph()
            .getStash()
            .trim();
    }
}

let drawdown = new Drawdown();

export { Drawdown as default, drawdown };
