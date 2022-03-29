<script lang="ts">
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import ImageGrid from "$lib/components/ImageGrid.svelte";
    import Lightbox from "$lib/components/lightbox/Lightbox.svelte";
    import Modal from "./lightbox/Modal.svelte";
    import { persisted } from "$lib/model/persisted";
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceStream } from "$lib/model/ImageSource";
    import IntersectionObserver from "./IntersectionObserver.svelte";

    const columnCount = persisted("columnCount", 3);
    const showIndex = persisted("showIndex", false);
    const showNsfw = persisted("showNsfw", false);

    let screenIsFilled = false;

    let fullScreen = false;
    $: if (fullScreen) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

    const minColumnWidth = 180; // allows for two-column layout on iPhone SE, most phones
    let viewportWidth: number = 1000; // arbitrary number to avoid NaN in maxColumnCount before init
    $: maxColumnCount = Math.max(Math.floor(viewportWidth / minColumnWidth), 1);
    $: limitColumnCount(maxColumnCount);

    function limitColumnCount(max: number) {
        $columnCount = Math.min($columnCount, max);
    }

    export let imageSource: Source<unknown, unknown>;
    const sourceStream = new SourceStream(imageSource);
    const imageFeed = new ImageFeed(sourceStream);

    let selectedImageIndex: number | null = null;
    $: selectedImage =
        selectedImageIndex !== null ? $imageFeed[selectedImageIndex] : null;
    $: previousImage =
        selectedImageIndex !== null ? $imageFeed[selectedImageIndex - 1] : null;
    $: nextImage =
        selectedImageIndex !== null ? $imageFeed[selectedImageIndex + 1] : null;

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
        imageFeed.at(nextIndex + 1); // load ahead
    }

    async function navigateToPreviousImage() {
        if ((selectedImageIndex as number) > 0) {
            selectedImageIndex = (selectedImageIndex as number) - 1;
        }
    }
</script>

<svelte:window bind:innerWidth={viewportWidth} />

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
        bind:imageSource
        bind:fullScreen
    />

    {#if selectedImage}
        <Lightbox
            image={selectedImage}
            prevImage={previousImage}
            {nextImage}
            on:next={navigateToNextImage}
            on:previous={navigateToPreviousImage}
            on:close={closeLightbox}
        />
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
