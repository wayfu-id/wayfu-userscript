/**
 * Classes for Modal
 */
export default class Modals {
    contens: number;
    element: HTMLElement;

    /** Construct and display the modal (Pivate Function) */
    #construct(text: string): Promise<void>;
    #construct(text: HTMLElement): Promise<void>;
    /** Construct and display the modal with custom title (Pivate Function) */
    #construct(text: string, title?: string): Promise<void>;
    /** Construct and display the modal with custom title (Pivate Function) */
    #construct(text: HTMLElement, title?: string): Promise<void>;
    /** Construct and display the confirmation modal with custom title (Pivate Function) */
    #construct(text: string, title?: string, confirm?: true): Promise<boolean>;
    /** Construct and display the confirmation modal with custom title (Pivate Function) */
    #construct(text: HTMLElement, title?: string, confirm?: true): Promise<boolean>;

    /** Construct and display the alert modal */
    alert(text: string, title?: string): Promise<void>;
    alert(text: HTMLElement, title?: string): Promise<void>;

    /** Construct and display the alert confirm */
    confirm(text: string, title?: string): Promise<boolean>;
    confirm(text: HTMLElement, title?: string): Promise<boolean>;

    /** Show or destroy progress panel */
    progressPanel(stat: boolean, callback?: (e: Event) => void): void;

    /** Show WayFu modal elements */
    show(): void;

    /** Destroy current popup modal */
    closed(e: Event): void;
}
export const modal: Modals;