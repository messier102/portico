<script lang="ts">
    import { onMount, tick } from "svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import ImageGrid from "$lib/components/ImageGrid.svelte";
    import Lightbox from "$lib/components/Lightbox.svelte";
    import { persisted } from "$lib/model/persisted";
    import { sleepMs } from "$lib/util/sleepMs";
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceStream } from "$lib/model/ImageSource";

    const columnCount = persisted("columnCount", 3);
    const showIndex = persisted("showIndex", false);
    const showNsfw = persisted("showNsfw", false);
    const autoRotate = persisted("autoRotate", false);

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

    function needToFetchImages() {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;

        const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 100;

        return scrolledToBottom;
    }

    onMount(async () => {
        await tick();

        while (!imageFeed.exhausted && needToFetchImages()) {
            console.log("Fetching more images");
            await imageFeed.requestFetch();
            await tick();
        }

        console.log("Done fetching");
    });

    async function handleScroll() {
        if (!imageFeed.exhausted && needToFetchImages()) {
            await imageFeed.requestFetch();
        }
    }

    async function handleResize() {
        // Seems like the resize event doesn't fire immediately on maximizing/restoring the window.
        await sleepMs(100);

        $columnCount = Math.min($columnCount, maxColumnCount);
    }

    function openLightbox(index: number) {
        selectedImageIndex = index;
        disableScrolling();
    }

    function closeLightbox() {
        selectedImageIndex = null;
        enableScrolling();
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

    let lastScrollPos: number;

    function disableScrolling() {
        lastScrollPos = document.documentElement.scrollTop;
        document.documentElement.style.position = "fixed";
        document.documentElement.style.top = `-${lastScrollPos}px`;
    }

    function enableScrolling() {
        document.documentElement.style.position = "static";
        document.documentElement.style.top = "auto";
        document.documentElement.scrollTop = lastScrollPos; // must be last
    }
</script>

<svelte:window
    bind:innerWidth={clientWidth}
    on:resize={handleResize}
    on:scroll={handleScroll}
/>

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
        <Lightbox
            image={selectedImage}
            autoRotate={$autoRotate}
            on:close={closeLightbox}
            on:next={navigateToNextImage}
            on:previous={navigateToPreviousImage}
        />
    {/if}

    <ImageGrid
        columnCount={$columnCount}
        showIndex={$showIndex}
        showNsfw={$showNsfw}
        images={$imageFeed}
        on:select={(e) => openLightbox(e.detail)}
    />
</main>

<style>
    main {
        user-select: none;
    }
</style>
