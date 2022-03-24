<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let target: HTMLElement;

    let observer = new IntersectionObserver(([entry]) => {
        dispatch(entry.isIntersecting ? "enter" : "exit");
    });

    onMount(() => observer.observe(target));
</script>

<div bind:this={target}>
    <slot />
</div>
