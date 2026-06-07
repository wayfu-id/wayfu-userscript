import App from "../../App";
import React, { useContext, createContext } from "react";

import type { ReactNode } from "react";

interface AppContextProp {
    app: App;
    children?: ReactNode;
}

const AppContext = createContext<App | undefined>(undefined);

export function useApp() {
    const app = useContext(AppContext);
    if (!app) throw new Error("useApp must be used inside <AppProvider>");
    return app;
}

export function AppProvider({ app, children }: AppContextProp) {
    return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}
