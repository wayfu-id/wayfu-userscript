/**
 * Regular Expression (RegExp) list pattern for some purpose
 */
const rgx = {
    forVersion: /^\d+(?:(?:\.|-)\d+[A-Za-z]?)*$/,
    getVersion: /(?:@version\s*(\d+(?:(?:\.|-)\d+[A-Za-z]?)*))/,
    phonePattern: /^(?:[\+\d]?[\- \d]{10,})(?:\s|$)/,
    phoneValue: /^[0\+]*(?:(\d{9,})|([\d]{1,3}(?:[\- ]?[\d]{2,})+))(\s|$)/,
    datePattern: /\d{1,4}[\/|-|:]\d{1,2}[\/|-|:]\d{2,4}/,
    formatedDate: /^\d{4}[\/|-|:]\d{1,2}[\/|-|:]\d{1,2}$/,
    forFilename: /(?!\s*$)\s*(?:(gagal|error)|(?:\(?([0-9]*)\)?)|([^_]*))(?:_|\s|$)/g,
    xlsxFileCheck: /^app.*\/vnd\.open[^\.]*(?:[^]*\.sheet)$/,
    // csvFileCheck: /^(?:app.*\/.*(?:csv|excel))|(?:text\/.*(?:csv|separated|plain).*)$/, // seems no longer needed
};

/**
 * This is default toLocaleDateString options
 */
const dateOptDefault = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

export { rgx, dateOptDefault };
export * from "./events";
export * from "./ui";
