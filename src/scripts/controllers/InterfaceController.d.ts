export default class InterfaceController {
    constructor(details: { [k: string]: string }): this;

    /** Inject all view */
    createView(details: { [k: string]: string }): this;

    /** Init all eventListener */
    initListener(): void;

    /** Static method to initialize current UI */
    static init(details: { [k: string]: string }): InterfaceController;
}