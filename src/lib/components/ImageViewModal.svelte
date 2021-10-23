<script lang="ts">
    import { swipeable, SwipeEvent } from "../actions/swipeable";
    import type { ImageFeed } from "../model/ImageFeed";
    import { fade } from "svelte/transition";
    import { sineInOut } from "svelte/easing";

    export let imageFeed: ImageFeed;
    export let selectedImageIndex = null;

    $: image = $imageFeed[selectedImageIndex];

    let rotationDegrees: number = 0;
    let lastScrollPos: number;

    export function openModal(idx: number) {
        selectedImageIndex = idx;
        lastScrollPos = document.documentElement.scrollTop;
        document.documentElement.style.position = "fixed";
        document.documentElement.style.top = `-${lastScrollPos}px`;
    }

    function closeModal() {
        rotationDegrees = 0;
        selectedImageIndex = null;
        document.documentElement.style.position = "static";
        document.documentElement.style.top = "auto";
        document.documentElement.scrollTop = lastScrollPos;
    }

    async function navigateToNextImage() {
        const nextIndex = selectedImageIndex + 1;
        await imageFeed.at(nextIndex);

        // TODO: Silently reset every 360 rotation to 0 to prevent excessive spin.
        // Not sure how to temporarily disable the rotation transition to do that.

        rotationDegrees = 0;
        selectedImageIndex = nextIndex;
    }

    async function navigateToPreviousImage() {
        if (selectedImageIndex > 0) {
            rotationDegrees = 0;
            selectedImageIndex -= 1;
        }
    }

    async function handleKeydown(e: KeyboardEvent) {
        console.log("Key down: " + e.code);
        if (selectedImageIndex !== null) {
            if (
                (e.code === "ArrowLeft" || e.code === "KeyA") &&
                selectedImageIndex > 0
            ) {
                await navigateToPreviousImage();
            } else if (e.code === "ArrowRight" || e.code === "KeyD") {
                await navigateToNextImage();
            } else if (e.code === "Escape") {
                closeModal();
            } else if (e.code === "KeyQ") {
                rotationDegrees = rotationDegrees - 90;
            } else if (e.code === "KeyE") {
                rotationDegrees = rotationDegrees + 90;
            }
        }
    }

    async function handleSwipe(e: SwipeEvent) {
        if (e.detail.direction === "up") {
            await navigateToNextImage();
        } else if (e.detail.direction === "down") {
            await navigateToPreviousImage();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if image}
    <div
        class="modal"
        use:swipeable
        on:click={() => closeModal()}
        on:swipe={(e) => handleSwipe(e)}
        transition:fade={{ duration: 200, easing: sineInOut }}
    >
        <img
            src={image.starred.imageUrl}
            alt={image.starred.name}
            class:rotated-90={(rotationDegrees + 90) % 180 === 0}
            style={`--angle: ${rotationDegrees}deg;
             --scale: ${image.img.height / image.img.width};`}
        />
    </div>
{/if}

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;

        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    img {
        object-fit: contain;
        height: 100vh;
        width: 100vw;
        transform: rotate(var(--angle));
        transition: 0.4s ease;
    }

    .rotated-90 {
        height: min(100vw, calc(100vh * var(--scale)));
        width: min(100vh, calc(100vw * var(--scale)));
    }
</style>
