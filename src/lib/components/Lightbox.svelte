<script lang="ts">
    import { swipeable, SwipeEvent } from "../actions/swipeable";
    import { AnnotatedImage } from "../model/ImageFeed";
    import { fade } from "svelte/transition";
    import { sineInOut } from "svelte/easing";
    import { createEventDispatcher, tick } from "svelte";

    const dispatch = createEventDispatcher();

    export let image: AnnotatedImage;
    export let autoRotate: boolean;
    $: {
        if (image && autoRotate) {
            tryAutoRotate();
        }
    }

    let showActionsPanel: boolean = true;
    let rotationDegrees: number = 0;

    function close() {
        dispatch("close");
    }

    async function navigate(direction: "next" | "previous") {
        // TODO: Silently reset every 360 rotation to 0 to prevent excessive spin.
        // Not sure how to temporarily disable the rotation transition to do that.
        rotationDegrees = 0;

        dispatch(direction);
    }

    function rotate(direction: "left" | "right") {
        rotationDegrees = rotationDegrees + (direction === "left" ? -90 : 90);
    }

    async function tryAutoRotate() {
        await tick();

        const { width: imgWidth, height: imgHeight } = image.img;
        const { clientWidth, clientHeight } = document.documentElement;

        if (
            (imgHeight > imgWidth && clientHeight < clientWidth) ||
            (imgHeight < imgWidth && clientHeight > clientWidth)
        ) {
            rotationDegrees = 90;
        }
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
            } else if (e.code === "Escape") {
                close();
            } else if (e.code === "KeyQ") {
                rotate("left");
            } else if (e.code === "KeyE") {
                rotate("right");
            }
        }
    }

    function handleSwipe(e: SwipeEvent) {
        if (e.detail.direction === "up") {
            navigate("next");
        } else if (e.detail.direction === "down") {
            navigate("previous");
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

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
            <button on:click={close}>
                <img
                    alt="Close lightbox"
                    src="/close.svg"
                    width="24px"
                    height="24px"
                />
            </button>

            <button on:click|stopPropagation={() => rotate("left")}>
                <img
                    alt="Rotate left"
                    src="/rotate-left.svg"
                    width="24px"
                    height="24px"
                />
            </button>

            <button on:click|stopPropagation={() => rotate("right")}>
                <img
                    alt="Rotate right"
                    src="/rotate-right.svg"
                    width="24px"
                    height="24px"
                />
            </button>

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
    .actions-panel {
        display: flex;
        justify-content: space-evenly;
        position: fixed;
        bottom: 5px;
        width: 300px;
        height: 50px;
        transition: 0.2s ease-in-out;
    }

    button {
        border-radius: 8px;
        display: flex;
        align-items: center;
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
