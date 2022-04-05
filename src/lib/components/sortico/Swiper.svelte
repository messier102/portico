<script lang="ts">
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceStream } from "$lib/model/ImageSource";
    import { onMount } from "svelte";
    import { sineOut } from "svelte/easing";
    import { tweened } from "svelte/motion";

    export let imageSource: Source<unknown, unknown>;
    const sourceStream = new SourceStream(imageSource);
    const imageFeed = new ImageFeed(sourceStream);

    onMount(() => {
        imageFeed.requestFetch();
    });

    let currentIndex = 0;
    $: currentImage = $imageFeed[currentIndex];
    $: nextImage = $imageFeed[currentIndex + 1];

    let isAnimating = false;

    const maxAngle = 30;
    let angle = tweened(0, { easing: sineOut, duration: 0 });
    let offsetY = tweened(0, { easing: sineOut, duration: 0 });
    $: scale = 0.5 + 0.5 * (Math.abs($angle) / maxAngle);

    let touchStartX = 0;
    let touchStartY = 0;
    let angleThreshold = 5;

    $: leftOpacity = $angle < 0 ? Math.sin(-$angle * (Math.PI / maxAngle)) : 0;
    $: rightOpacity = $angle > 0 ? Math.sin($angle * (Math.PI / maxAngle)) : 0;

    function handleTouchStart(event: TouchEvent) {
        isAnimating = true;
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }

    function handleTouchMove(event: TouchEvent) {
        const touchMoveX = event.changedTouches[0].clientX;
        const touchMoveY = event.changedTouches[0].clientY;
        const touchDeltaX = touchMoveX - touchStartX;
        const touchDeltaY = touchMoveY - touchStartY;

        $angle = touchDeltaX / maxAngle;
        $offsetY = touchDeltaY;
    }

    async function handleTouchEnd(event: TouchEvent) {
        if (Math.abs($angle) > angleThreshold) {
            await angle.set(maxAngle * Math.sign($angle), { duration: 500 });

            currentIndex += 1;

            $angle = 0;
            $offsetY = 0;
        } else {
            await Promise.all([
                angle.set(0, { duration: 500 }),
                offsetY.set(0, { duration: 500 }),
            ]);
        }

        isAnimating = false;
    }
</script>

<div class="wrapper">
    {#if currentImage}
        <img
            class="current"
            class:animating={isAnimating}
            src={currentImage.starred.imageUrl}
            alt={currentImage.starred.name}
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
            on:touchend={handleTouchEnd}
            style:--angle={$angle + "deg"}
            style:--offsetY={$offsetY + "px"}
        />
    {:else}
        <button on:click={() => (currentIndex = 0)}>Reset</button>
    {/if}

    {#if nextImage}
        <img
            class="next"
            class:animating={isAnimating}
            src={nextImage.starred.imageUrl}
            alt={nextImage.starred.name}
            style:--scale={scale}
        />
    {/if}

    <div class="left-gradient" style:--left-opacity={leftOpacity} />
    <div class="right-gradient" style:--right-opacity={rightOpacity} />
</div>

<style>
    /* prevent reflow caused by address bar hiding on mobile */
    :global(html),
    :global(body) {
        margin: 0;
        height: 100%;
        overflow: hidden;
        overscroll-behavior: contain;
    }

    .wrapper {
        position: relative;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    img {
        position: absolute;
        top: 0;
        left: 0;
        object-fit: contain;
        width: 100%;
        height: 100%;
    }

    .current {
        transform: rotate(var(--angle)) translateY(var(--offsetY));
        transform-origin: center 300%;
        z-index: 100;
        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
    }

    .next {
        transform: scale(var(--scale));
    }

    .animating {
        will-change: transform;
    }

    .left-gradient {
        z-index: 101;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            65deg,
            rgba(11, 146, 250, 0.8),
            rgba(0, 0, 0, 0) 50%
        );
        opacity: var(--left-opacity);
        pointer-events: none;
    }

    .right-gradient {
        z-index: 101;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            -65deg,
            rgba(250, 71, 11, 0.8),
            rgba(0, 0, 0, 0) 50%
        );
        opacity: var(--right-opacity);
        pointer-events: none;
    }
</style>
