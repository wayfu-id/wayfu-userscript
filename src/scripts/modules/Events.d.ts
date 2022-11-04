/**
 * A bunch of EventListener
 * @class AppEvents
 */
export default class AppEvents {
    /** Run blast tasks */
    runTasks(e: Event): Promise<void>;

    /** Tab menu Listener */
    tabMenu(e: Event): void;

    /** For preview text message and caption (if any) */
    textPreview(e: Event): void;

    /** Set message from its type (form or caption) */
    updateText(e: Event): void;

    /** Allow message to attach an Image */
    useImage(e: Event): Promise<void>;

    /** Load file recipients Data */
    loadData(e: Event): Promise<void>;

    /** Read and preview an Image File */
    imagePreview(e: Event): void;

    /** Open and close panel toggle button */
    toggleApp(e: Event): void;

    /** For input type `Range` element(s) */
    inputRange(e: Event): void;

    /** For input type `Check` element(s) */
    inputChecks(e: Event): void;

    /** For input type `Select` element(s) */
    inputSelects(e: Event): void;

    /** ChangeLog listener */
    changeLog(e: Event): void;

    /** Checing current chat active */
    checkChat(e: Event): Promise<void>;
}

export const listeners: AppEvents;