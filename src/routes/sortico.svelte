<script lang="ts">
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { SourceStream } from "$lib/model/ImageSource";
    import { RedditSubredditSource } from "$lib/model/sources/reddit/subreddit";
    import { onMount } from "svelte";
    import { sineOut } from "svelte/easing";
    import { tweened } from "svelte/motion";

    const subreddit = "kemonomimi";
    const imageSource = new RedditSubredditSource(subreddit, "", "day");
    const sourceStream = new SourceStream(imageSource);
    const imageFeed = new ImageFeed(sourceStream);

    onMount(() => {
        imageFeed.requestFetch();
    });
    let currentIndex = 0;
    $: currentImage = $imageFeed[currentIndex];
    $: nextImage = $imageFeed[currentIndex + 1];

    let angle = tweened(0, { easing: sineOut, duration: 0 });
    let scale = tweened(0.5, { easing: sineOut, duration: 0 });
    let touchStartX = 0;

    function handleTouchStart(event: TouchEvent) {
        touchStartX = event.changedTouches[0].clientX;
    }

    function handleTouchMove(event: TouchEvent) {
        const touchMoveX = event.changedTouches[0].clientX;
        const touchDeltaX = touchMoveX - touchStartX;

        $angle = touchDeltaX / 30;
        $scale = 0.5 + Math.abs(touchDeltaX) / 1000;
    }

    async function handleTouchEnd(event: TouchEvent) {
        if (Math.abs($angle) > 5) {
            await Promise.all([
                angle.set(30 * Math.sign($angle), { duration: 500 }),
                scale.set(1, { duration: 500 }),
            ]);

            currentIndex += 1;

            $angle = 0;
            $scale = 0.5;
        } else {
            angle.set(0, { duration: 500 });
            scale.set(0.5, { duration: 500 });
        }
    }
</script>

<main>
    <div class="wrapper">
        {#if currentImage}
            <img
                class="current"
                src={currentImage.starred.imageUrl}
                alt={currentImage.starred.name}
                on:touchstart={handleTouchStart}
                on:touchmove={handleTouchMove}
                on:touchend={handleTouchEnd}
                style:--angle={$angle + "deg"}
            />
        {/if}
        {#if nextImage}
            <img
                class="next"
                src={nextImage.starred.imageUrl}
                alt={nextImage.starred.name}
                style:--scale={$scale}
            />
        {/if}
    </div>
</main>

<style>
    main {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
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
        transform: rotate(var(--angle));
        transform-origin: 50% 200%;
        z-index: 100;
        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.6));
    }

    .next {
        transform: scale(var(--scale));
    }
</style>
