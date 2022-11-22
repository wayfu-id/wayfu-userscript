/** Regular Expression (RegExp) list pattern for some purpose */
export namespace rgx {
    const forVersion: RegExp;
    const getVersion: RegExp;
    const phonePattern: RegExp;
    const phoneValue: RegExp;
    const datePattern: RegExp;
    const formatedDate: RegExp;
    const forFilename: RegExp;
    const xlsxFileCheck: RegExp;
    // const csvFileCheck: RegExp; // seems no longer needed
}

/** Element's query selector list for some kind of element */
export namespace queryElm {
    const send: string;
    const input: string;
    const linkElm: string;
    const errModal: string;
    const chatMessage: string;
}

/** This is default toLocaleDateString options */
export namespace dateOptDefault {
    const year: string;
    const month: string;
    const day: string;
}

/** Event lists details to create eventListener */
export const eventLists: {
    element: string;
    type: string;
    event: string;
}[];

/** WAPI modules that needed to get */
export const storeObjects: {
    id: string;
    conditions: (module: any) => any;
}[];