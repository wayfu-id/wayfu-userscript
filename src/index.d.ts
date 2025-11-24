import WAPI from "@wayfu/simple-wapi";

declare module "index" {
    export {};
}

declare global {
    interface Window {
        WAPI: WAPI
    }
}
