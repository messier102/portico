<script lang="ts">
    import { swipeable, SwipeEvent } from "../actions/swipeable";
    import { ImageFeed } from "../model/ImageFeed";
    import { fade } from "svelte/transition";
    import { sineInOut } from "svelte/easing";
    import { tick } from "svelte";

    export let imageFeed: ImageFeed;
    export let selectedImageIndex: number | null = null;
    export let autoRotate: boolean = false;

    let showActionsPanel: boolean = true;

    $: image =
        selectedImageIndex !== null
            ? $imageFeed[selectedImageIndex]
            : undefined;

    let rotationDegrees: number = 0;
    let lastScrollPos: number;

    export async function openModal(idx: number): Promise<void> {
        showActionsPanel = true;
        selectedImageIndex = idx;
        lastScrollPos = document.documentElement.scrollTop;
        document.documentElement.style.position = "fixed";
        document.documentElement.style.top = `-${lastScrollPos}px`;

        if (autoRotate) {
            tryAutoRotate();
        }
    }

    async function tryAutoRotate() {
        await tick();

        const { width: imgWidth, height: imgHeight } = image!.img;
        const { clientWidth, clientHeight } = document.documentElement;

        if (
            (imgHeight > imgWidth && clientHeight < clientWidth) ||
            (imgHeight < imgWidth && clientHeight > clientWidth)
        ) {
            rotationDegrees = 90;
        }
    }

    function closeModal() {
        rotationDegrees = 0;
        selectedImageIndex = null;
        document.documentElement.style.position = "static";
        document.documentElement.style.top = "auto";
        document.documentElement.scrollTop = lastScrollPos;
    }

    async function navigateToNextImage() {
        const nextIndex = (selectedImageIndex as number) + 1;
        await imageFeed.at(nextIndex);

        // TODO: Silently reset every 360 rotation to 0 to prevent excessive spin.
        // Not sure how to temporarily disable the rotation transition to do that.

        rotationDegrees = 0;
        selectedImageIndex = nextIndex;

        if (autoRotate) {
            tryAutoRotate();
        }
    }

    async function navigateToPreviousImage() {
        if ((selectedImageIndex as number) > 0) {
            rotationDegrees = 0;
            selectedImageIndex = (selectedImageIndex as number) - 1;

            if (autoRotate) {
                tryAutoRotate();
            }
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
        on:click={() => (showActionsPanel = !showActionsPanel)}
        on:swipe={(e) => handleSwipe(e)}
        transition:fade={{ duration: 200, easing: sineInOut }}
    >
        <img
            class="image"
            src={image.starred.imageUrl}
            alt={image.starred.name}
            class:rotated-90={(rotationDegrees + 90) % 180 === 0}
            style={`--angle: ${rotationDegrees}deg;
             --scale: ${image.img.height / image.img.width};`}
        />

        {#if showActionsPanel}
            <div
                class="actions-panel"
                transition:fade={{ duration: 200, easing: sineInOut }}
            >
                <button on:click={closeModal}>
                    <img
                        alt="Close lightbox"
                        src="/close.svg"
                        width="24px"
                        height="24px"
                    />
                </button>
            </div>
        {/if}
    </div>
{/if}

<style>
    .actions-panel {
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background-color: red;
        transition: 0.2s ease-in-out;
    }

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

    .image {
        object-fit: contain;
        height: 100vh;
        width: 100vw;
        transform: rotate(var(--angle));
        transition: 0.4s ease;
    }

    .rotated-90 {
        height: min(100vw, calc(100vh * var(--scale)));
        width: max(100vh, calc(100vw * var(--scale)));
    }
</style>
