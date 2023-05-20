import DOM, { elemenOptions } from "./DOM";

/**
 * Classes for Modal
 */
export default class Modal {
    main: DOM;
    element: DOM;

    get contens(): Number;
    get element(): DOM;
    set element(ele: DOM): void;

    /** Construct and display the modal */
    addContent(content: string | HTMLElement | elemenOptions | DOM): Promise<void>;
    addContent(content: string | HTMLElement | elemenOptions | DOM, title?: string): Promise<void>;
    addContent(content: string | HTMLElement | elemenOptions | DOM, title?: string, confirm?: Boolean): Promise<void>;
    
    /** Remove modal item */
    remove(query: string | HTMLElement | DOM): DOM

    /** Just to show modal */
    show(): void;

    /** Destroy current popup modal */
    closed(e: Event): void;

    /** Construct and display the alert modal */
    static alert(content: string | HTMLElement | elemenOptions | DOM): Promise<void>;
    static alert(content: string | HTMLElement | elemenOptions | DOM, title?: string): Promise<void>;

    /** Construct and display the alert confirm */
    static confirm(content: string | HTMLElement | elemenOptions | DOM): Promise<boolean>;
    static confirm(content: string | HTMLElement | elemenOptions | DOM, title?: string): Promise<boolean>;

    /** Show or destroy progress panel */
    static progressPanel(stat: boolean, callback?: (e: Event) => void): void;
}