<script lang="ts">
    import { onMount, tick } from "svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import ImageGrid from "$lib/components/ImageGrid.svelte";
    import ImageViewModal from "$lib/components/ImageViewModal.svelte";
    import { persisted } from "$lib/model/persisted";
    import { sleepMs } from "$lib/util/sleepMs";
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceStream } from "$lib/model/ImageSource";

    const columnCount = persisted("columnCount", 3);
    const showIndex = persisted("showIndex", false);
    const showNsfw = persisted("showNsfw", false);
    const autoRotate = persisted("autoRotate", false);

    const minColumnWidth = 155;
    let clientWidth: number;
    $: maxColumnCount = Math.max(Math.floor(clientWidth / minColumnWidth), 1);

    export let imageSource: Source<unknown, unknown>;
    const sourceStream = new SourceStream(imageSource);
    const imageFeed = new ImageFeed(sourceStream);

    let openModal: (idx: number) => Promise<void>;

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
    />

    <ImageViewModal {imageFeed} autoRotate={$autoRotate} bind:openModal />

    <ImageGrid
        columnCount={$columnCount}
        showIndex={$showIndex}
        showNsfw={$showNsfw}
        images={$imageFeed}
        on:select={(e) => openModal(e.detail)}
    />
</main>

<style>
    main {
        user-select: none;
    }
</style>
