// hooks/useAppEvent.ts
import { useState, useEffect, useRef, useMemo } from "react";
import { useApp } from "../context/AppContext";
import type { AppEventMap } from "../../events";

type Handler<T> = T extends void ? () => void : (data: T) => void;

type EventHandlerMap = {
    [K in keyof AppEventMap]?: Handler<AppEventMap[K]["payload"]>;
};

export function useAppEvent<K extends keyof AppEventMap>(event: K, callback: Handler<AppEventMap[K]["payload"]>) {
    const app = useApp();

    // store latest callback in a ref — always current, never stale
    const callbackRef = useRef(callback);
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        if (!app) return;
        // stable wrapper — registered once, always calls latest callback
        const handler = ((...args: any[]) => (callbackRef.current as any)(...args)) as any;

        app.on(event, handler);
        return () => app.remove(event, handler);
    }, [app, event]); // deps stay minimal — no callback here
}

export function useAppEvents(handlers: EventHandlerMap) {
    const app = useApp();

    // store all callbacks in refs — same stale closure fix
    const handlersRef = useRef(handlers);
    useEffect(() => {
        handlersRef.current = handlers;
    });

    useEffect(() => {
        if (!app) return;

        // register a stable wrapper for each event
        const stableHandlers = Object.entries(handlersRef.current).map(([event, _]) => {
            const stable = ((...args: any[]) =>
                (handlersRef.current[event as keyof AppEventMap] as any)?.(...args)) as any;
            return { event: event as keyof AppEventMap, stable };
        });

        stableHandlers.forEach(({ event, stable }) => app.on(event, stable));
        return () => {
            stableHandlers.forEach(({ event, stable }) => app.remove(event, stable));
        };
    }, [app]); // deps stay minimal — same principle as single version
}

export function useWaydown(source: string, plain = false, debounceMs = 300) {
    const { Waydown } = useApp();
    const [debounced, setDebounced] = useState(source);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(source), debounceMs);
        return () => clearTimeout(timer);
    }, [source, debounceMs]);

    return useMemo(() => {
        try {
            return Waydown(debounced, plain);
        } catch (e) {
            return debounced.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
    }, [debounced, plain]);
}
