<script lang="ts">
    import { tweened } from "svelte/motion";
    import { AnnotatedImage } from "../model/ImageFeed";
    import { fade } from "svelte/transition";
    import { cubicOut, sineInOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let image: AnnotatedImage;
    export let prevImage: AnnotatedImage | null;
    export let nextImage: AnnotatedImage | null;

    let showActionsPanel: boolean = true;

    // see https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
    let viewportHeight: number = 0;
    let viewportWidth: number = 0;

    function navigate(direction: "next" | "previous") {
        dispatch(direction);
    }

    function handleKeydown(e: KeyboardEvent) {
        console.log("Key down: " + e.code);
        if (e.code === "Space") {
            showActionsPanel = !showActionsPanel;
        } else {
            showActionsPanel = false;

            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                navigate("previous");
            } else if (e.code === "ArrowRight" || e.code === "KeyD") {
                navigate("next");
            }
        }
    }

    let touchStartViewportY = 0;
    let touchStartLightboxTranslateY = 0;

    let lightboxTranslateY = tweened<number>(0, {
        easing: cubicOut,
        duration: 0,
    });
    $: lightboxTranslateDeltaY =
        $lightboxTranslateY - touchStartLightboxTranslateY;

    let transition: "previous" | "none" | "next" = "none";

    function handleTouchStart(e: TouchEvent) {
        if ($lightboxTranslateY !== 0) {
            // if in the middle of a transition, fix it in place
            $lightboxTranslateY = $lightboxTranslateY;

            // if in the middle of a transition, perform navigation and move
            // lightbox to match the Y position
            if (transition === "previous") {
                navigate("previous");
                $lightboxTranslateY -= document.documentElement.clientHeight;
                transition = "none";
            } else if (transition === "next") {
                navigate("next");
                $lightboxTranslateY += document.documentElement.clientHeight;
                transition = "none";
            }
        }

        touchStartViewportY = e.changedTouches[0].clientY;
        touchStartLightboxTranslateY = $lightboxTranslateY;
    }

    function handleTouchMove(e: TouchEvent) {
        const touchMoveViewportY = e.changedTouches[0].clientY;
        const touchDeltaY = touchMoveViewportY - touchStartViewportY;

        $lightboxTranslateY = touchStartLightboxTranslateY + touchDeltaY;
    }

    async function handleTouchEnd(e: TouchEvent) {
        const swipeThreshold = 100;

        if (lightboxTranslateDeltaY > swipeThreshold && prevImage) {
            // go to previous
            transition = "previous";

            await lightboxTranslateY.set(
                document.documentElement.clientHeight,
                { duration: 500 }
            );
            navigate("previous");
            transition = "none";
        } else if (lightboxTranslateDeltaY < -swipeThreshold && nextImage) {
            // go to next
            transition = "next";
            await lightboxTranslateY.set(
                -document.documentElement.clientHeight,
                { duration: 500 }
            );
            navigate("next");
            transition = "none";
        } else {
            // reset
            await lightboxTranslateY.set(0, { duration: 500 });
        }

        $lightboxTranslateY = 0;
        touchStartViewportY = 0;
    }
</script>

<svelte:window
    on:keydown={handleKeydown}
    bind:innerHeight={viewportHeight}
    bind:innerWidth={viewportWidth}
/>

<div class="lightbox" on:click={() => (showActionsPanel = !showActionsPanel)}>
    <div
        class="image-container"
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
        style:--viewportHeight={`${viewportHeight}px`}
        style:--translateY={`${$lightboxTranslateY}px`}
    >
        {#if prevImage}
            <div class="prev-image">
                <img
                    class="image"
                    src={prevImage.starred.imageUrl}
                    alt={prevImage.starred.name}
                />
            </div>
        {/if}

        <div class="current-image">
            <img
                class="image"
                src={image.starred.imageUrl}
                alt={image.starred.name}
            />
        </div>

        {#if nextImage}
            <div class="next-image">
                <img
                    class="image"
                    src={nextImage.starred.imageUrl}
                    alt={nextImage.starred.name}
                />
            </div>
        {/if}
    </div>

    {#if showActionsPanel}
        <div
            class="actions-panel"
            transition:fade={{ duration: 200, easing: sineInOut }}
        >
            <button on:click|stopPropagation={() => navigate("previous")}>
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img
                    alt="Previous image"
                    src="/left.svg"
                    width="24px"
                    height="24px"
                />
            </button>

            <button on:click|stopPropagation={() => navigate("next")}>
                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img
                    alt="Next image"
                    src="/right.svg"
                    width="24px"
                    height="24px"
                />
            </button>
        </div>
    {/if}
</div>

<style>
    .image-container {
        display: grid;
        grid-template-rows: repeat(3, var(--viewportHeight));
        transform: translateY(var(--translateY));
    }

    .image {
        object-fit: contain;
        height: 100%;
        width: 100%;
    }

    .prev-image {
        grid-row: 1 / span 1;
    }

    .current-image {
        grid-row: 2 / span 1;
    }

    .next-image {
        grid-row: 3 / span 1;
    }

    .actions-panel {
        display: flex;
        justify-content: space-evenly;
        position: fixed;
        bottom: 5px;
        width: 260px;
        height: 50px;
        transition: 0.2s ease-in-out;
    }

    button {
        border-radius: 8px;
        display: flex;
        align-items: center;
    }

    .lightbox {
        display: flex;
        justify-content: center;
    }
</style>
