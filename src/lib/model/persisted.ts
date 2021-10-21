import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export function persisted<T>(key: string, initial: T): Writable<T> {
    const previousValue = JSON.parse(window.localStorage.getItem(key));

    const store = writable(previousValue ?? initial);

    store.subscribe((value) => {
        return window.localStorage.setItem(key, JSON.stringify(value));
    });

    return store;
}
