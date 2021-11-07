import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export function persisted<T>(key: string, initial: T): Writable<T> {
    const previousValueStr = window.localStorage.getItem(key);
    const previousValue = previousValueStr
        ? JSON.parse(previousValueStr)
        : initial;

    const store = writable(previousValue);

    store.subscribe((value) => {
        return window.localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}
