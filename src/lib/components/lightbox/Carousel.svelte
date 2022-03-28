<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { cubicOut } from "svelte/easing";
    import { tweened } from "svelte/motion";

    const dispatch = createEventDispatcher();

    const swipeThresholdPx = 100;
    const swipeDurationMs = 500;

    export let hasPrevious: boolean = false;
    export let hasNext: boolean = false;

    // https://chanind.github.io/javascript/2019/09/28/avoid-100vh-on-mobile-web.html
    let viewportHeight: number = 0;

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

    function handleTouchEnd(_: TouchEvent) {
        const sliderOffsetDeltaY = $sliderOffsetY - sliderInitialOffsetY;

        if (sliderOffsetDeltaY > swipeThresholdPx && hasPrevious) {
            dispatch("previous");

            $sliderOffsetY -= viewportHeight;
        } else if (sliderOffsetDeltaY < -swipeThresholdPx && hasNext) {
            dispatch("next");

            $sliderOffsetY += viewportHeight;
        }

        // parent component MUST handle navigation events for this to work
        // TODO: a way to better decouple this
        sliderOffsetY.set(0, { duration: swipeDurationMs });
    }

    function handleTouchCancel() {
        sliderOffsetY.set(0, { duration: swipeDurationMs });
    }
</script>

<svelte:window bind:innerHeight={viewportHeight} />

<div
    class="slider"
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
    on:touchcancel={handleTouchCancel}
    style:--viewportHeight={`${viewportHeight}px`}
    style:--sliderOffsetY={`${$sliderOffsetY}px`}
>
    <div class="previous">
        <slot name="previous" />
    </div>

    <div class="current">
        <slot name="current" />
    </div>

    <div class="next">
        <slot name="next" />
    </div>
</div>

<style>
    .slider {
        display: grid;
        grid-template-rows: repeat(3, var(--viewportHeight));
        transform: translateY(var(--sliderOffsetY));
    }

    .previous {
        grid-row: 1 / span 1;
    }

    .current {
        grid-row: 2 / span 1;
    }

    .next {
        grid-row: 3 / span 1;
    }
</style>
