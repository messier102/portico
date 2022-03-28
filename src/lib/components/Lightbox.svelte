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

    let touchStartY = 0;

    let sliderInitialOffsetY = 0;

    let sliderOffsetY = tweened(0, {
        easing: cubicOut,
        duration: 0,
    });

    function handleTouchStart(event: TouchEvent) {
        if ($sliderOffsetY !== 0) {
            // stop tweening and pin slider in place
            $sliderOffsetY = $sliderOffsetY;
        }

        touchStartY = event.changedTouches[0].clientY;
        sliderInitialOffsetY = $sliderOffsetY;
    }

    function handleTouchMove(event: TouchEvent) {
        const touchMoveY = event.changedTouches[0].clientY;
        const touchDeltaY = touchMoveY - touchStartY;

        $sliderOffsetY = sliderInitialOffsetY + touchDeltaY;
    }

    async function handleTouchEnd(_: TouchEvent) {
        const swipeThreshold = 100;
        const sliderOffsetDeltaY = $sliderOffsetY - sliderInitialOffsetY;

        if (sliderOffsetDeltaY > swipeThreshold && prevImage) {
            navigate("previous");

            $sliderOffsetY -= viewportHeight;
        } else if (sliderOffsetDeltaY < -swipeThreshold && nextImage) {
            navigate("next");

            $sliderOffsetY += viewportHeight;
        }

        await sliderOffsetY.set(0, { duration: 500 });
    }

    async function handleTouchCancel() {
        await sliderOffsetY.set(0, { duration: 500 });
    }
</script>

<svelte:window
    on:keydown={handleKeydown}
    bind:innerHeight={viewportHeight}
    bind:innerWidth={viewportWidth}
/>

<div class="lightbox" on:click={() => (showActionsPanel = !showActionsPanel)}>
    <div
        class="slider"
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleTouchEnd}
        on:touchcancel={handleTouchCancel}
        style:--viewportHeight={`${viewportHeight}px`}
        style:--sliderOffsetY={`${$sliderOffsetY}px`}
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
    .slider {
        display: grid;
        grid-template-rows: repeat(3, var(--viewportHeight));
        transform: translateY(var(--sliderOffsetY));
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
