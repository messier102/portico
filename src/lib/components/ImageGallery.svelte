<script lang="ts">
    import { onMount, tick } from "svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import ImageGrid from "$lib/components/ImageGrid.svelte";
    import Lightbox from "$lib/components/Lightbox.svelte";
    import Modal from "./Modal.svelte";
    import { persisted } from "$lib/model/persisted";
    import { sleepMs } from "$lib/util/sleepMs";
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceStream } from "$lib/model/ImageSource";
    import IntersectionObserver from "./IntersectionObserver.svelte";

    const columnCount = persisted("columnCount", 3);
    const showIndex = persisted("showIndex", false);
    const showNsfw = persisted("showNsfw", false);
    const autoRotate = persisted("autoRotate", false);

    let screenIsFilled = false;

    let fullScreen = false;
    $: if (fullScreen) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

    const minColumnWidth = 155;
    let clientWidth: number;
    $: maxColumnCount = Math.max(Math.floor(clientWidth / minColumnWidth), 1);

    export let imageSource: Source<unknown, unknown>;
    const sourceStream = new SourceStream(imageSource);
    const imageFeed = new ImageFeed(sourceStream);

    let selectedImageIndex: number | null = null;
    $: selectedImage =
        selectedImageIndex !== null ? $imageFeed[selectedImageIndex] : null;

    onMount(async () => {
        await tick(); // why is this here again?
    });

    async function tryFetch() {
        do {
            console.log("Trying to fetch");

            if (!imageFeed.exhausted) {
                console.log("Fetching");
                await imageFeed.requestFetch();
            }

            console.log("Done fetching");
        } while (!screenIsFilled);
    }

    async function handleResize() {
        // Seems like the resize event doesn't fire immediately on maximizing/restoring the window.
        await sleepMs(100);

        $columnCount = Math.min($columnCount, maxColumnCount);
    }

    function openLightbox(index: number) {
        selectedImageIndex = index;
    }

    function closeLightbox() {
        selectedImageIndex = null;
    }

    async function navigateToNextImage() {
        const nextIndex = (selectedImageIndex as number) + 1;
        await imageFeed.at(nextIndex);
        selectedImageIndex = nextIndex;
    }

    async function navigateToPreviousImage() {
        if ((selectedImageIndex as number) > 0) {
            selectedImageIndex = (selectedImageIndex as number) - 1;
        }
    }
</script>

<svelte:window bind:innerWidth={clientWidth} on:resize={handleResize} />

<svelte:head>
    <title>
        {imageSource.name} - Portico
    </title>
</svelte:head>

<main>
    <ControlPanel
        {maxColumnCount}
        bind:columnCount={$columnCount}
        bind:showIndex={$showIndex}
        bind:showNsfw={$showNsfw}
        bind:autoRotate={$autoRotate}
        bind:imageSource
        bind:fullScreen
    />

    {#if selectedImage}
        <Modal on:close={closeLightbox}>
            <Lightbox
                image={selectedImage}
                autoRotate={$autoRotate}
                on:next={navigateToNextImage}
                on:previous={navigateToPreviousImage}
            />
        </Modal>
    {/if}

    <ImageGrid
        columnCount={$columnCount}
        showIndex={$showIndex}
        showNsfw={$showNsfw}
        images={$imageFeed}
        on:select={(e) => openLightbox(e.detail)}
    />

    <IntersectionObserver
        on:enter={tryFetch}
        on:exit|once={() => (screenIsFilled = true)}
    >
        <img
            class="loading"
            alt="Loading indicator"
            src="/loading.svg"
            width="50px"
        />
    </IntersectionObserver>
</main>

<style>
    main {
        user-select: none;
    }

    .loading {
        display: block;
        margin: auto;
        margin-top: 20px;
        margin-bottom: 60px;
        filter: invert();
        animation: spin 1.5s infinite linear;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
</style>
