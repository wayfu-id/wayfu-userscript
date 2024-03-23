import GM_Library from "./models/GM_Library";

export default class App extends GM_Library {
    constructor(target: Window);
    debug(e: any): App;
    
    initialize(target: Window): Promise<void>;
    // Create App Panel
    registerPanel(): void;
    // Initialize and Register the User
    registerUser(): void;
    // Initialize and Register the App Options
    registerOptions(): void;
    // Whenever all loaded
    onLoadView(): Promise<void>;
}