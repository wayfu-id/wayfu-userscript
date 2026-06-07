import type { AppEventMap } from "../events";

type Payload<K extends keyof AppEventMap> = AppEventMap[K]["payload"];
type Return<K extends keyof AppEventMap> = AppEventMap[K]["return"];

type Handler<P, R> = P extends void ? () => R | Promise<R> : (data: P) => R | Promise<R>;

export default class EventBus {
    private listeners: Partial<{
        [K in keyof AppEventMap]: Handler<Payload<K>, Return<K>>[];
    }> = {};

    on<K extends keyof AppEventMap>(event: K, fn: Handler<Payload<K>, Return<K>>) {
        (this.listeners[event] ??= [] as any).push(fn);
    }

    remove<K extends keyof AppEventMap>(event: K, fn: Handler<Payload<K>, Return<K>>) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event]!.filter((l) => l !== fn) as any;
    }

    // fire and forget — no return
    trigger<K extends keyof AppEventMap>(
        ...args: Payload<K> extends void ? [event: K] : [event: K, data: Payload<K>]
    ): void {
        const [event, data] = args;
        this.listeners[event]?.forEach((fn) => (fn as any)(data));
    }

    async request<K extends keyof AppEventMap>(
        ...args: AppEventMap[K] extends void ? [event: K] : [event: K, data: Payload<K>]
    ): Promise<Return<K>> {
        const [event, data] = args;
        return await (this.listeners[event]?.[0] as any)?.(data);
    }
}
