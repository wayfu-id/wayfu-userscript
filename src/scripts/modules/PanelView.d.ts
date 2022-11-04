type appDetails = {
    name: string;
    version: string;
    icon: string;
};

/** Initialize all event listener */
declare function initListener(): void;

/** Create and Construct Panel View */
export function createView(html: string, style: string, details: appDetails): void;