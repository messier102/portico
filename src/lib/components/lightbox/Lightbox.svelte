<script lang="ts">
    import { AnnotatedImage } from "$lib/model/ImageFeed";
    import { fade } from "svelte/transition";
    import { sineInOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";
    import Carousel from "./Carousel.svelte";
    import Modal from "./Modal.svelte";

    const dispatch = createEventDispatcher();

    export let image: AnnotatedImage;
    export let prevImage: AnnotatedImage | null = null;
    export let nextImage: AnnotatedImage | null = null;

    let showActionsPanel: boolean = true;

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
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal on:close>
    <div
        class="lightbox"
        on:click={() => (showActionsPanel = !showActionsPanel)}
    >
        <Carousel
            hasPrevious={Boolean(prevImage)}
            hasNext={Boolean(nextImage)}
            on:next
            on:previous
        >
            <svelte:fragment slot="previous">
                {#if prevImage}
                    <img
                        class="image"
                        src={prevImage.starred.imageUrl}
                        alt={prevImage.starred.name}
                    />
                {/if}
            </svelte:fragment>

            <svelte:fragment slot="current">
                <img
                    class="image"
                    src={image.starred.imageUrl}
                    alt={image.starred.name}
                />
            </svelte:fragment>

            <svelte:fragment slot="next">
                {#if nextImage}
                    <img
                        class="image"
                        src={nextImage.starred.imageUrl}
                        alt={nextImage.starred.name}
                    />
                {/if}
            </svelte:fragment>
        </Carousel>

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
</Modal>

<style>
    .lightbox {
        display: flex;
        justify-content: center;
    }

    .image {
        object-fit: contain;
        height: 100%;
        width: 100%;
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
</style>
