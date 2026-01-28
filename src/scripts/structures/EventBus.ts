export default class EventBus {
    private listeners: Record<string, Function[]> = {};

    on(event: string, fn: Function) {
        (this.listeners[event] ||= []).push(fn);
    }

    remove(event: string, fn: Function) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter((listener) => listener !== fn);
    }

    trigger(event: string, ...args: any[]) {
        (this.listeners[event] || []).forEach((fn) => fn(...args));
    }
}
