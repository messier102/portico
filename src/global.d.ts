/// <reference types="svelte" />
declare namespace svelte.JSX {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface HTMLAttributes<T> {
        onswipe?: (
            event: CustomEvent<{
                direction: "up" | "down" | "left" | "right";
            }> & {
                target: EventTarget & T;
            }
        ) => unknown;
    }
}
