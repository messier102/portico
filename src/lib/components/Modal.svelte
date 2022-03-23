<script lang="ts">
    import { fade } from "svelte/transition";
    import { sineInOut } from "svelte/easing";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let lastScrollPosition: number;

    onMount(() => {
        disableBackgroundScrolling();

        return () => {
            enableBackgroundScrolling();
        };
    });

    function disableBackgroundScrolling() {
        lastScrollPosition = document.documentElement.scrollTop;
        document.documentElement.style.position = "fixed";
        document.documentElement.style.top = `-${lastScrollPosition}px`;
    }

    function enableBackgroundScrolling() {
        document.documentElement.style.position = "static";
        document.documentElement.style.top = "auto";
        document.documentElement.scrollTop = lastScrollPosition; // must be last
    }

    function closeModal() {
        dispatch("close");
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal" transition:fade={{ duration: 200, easing: sineInOut }}>
    <button class="close-btn" on:click={closeModal}>
        <img alt="Close modal" src="/close.svg" width="24px" height="24px" />
    </button>

    <slot />
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .close-btn {
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 101;
        background: none;
        border: none;
        filter: invert() drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.7));
        display: flex;
        align-items: center;
    }
</style>
