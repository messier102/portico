<script lang="ts">
    import { onMount, tick } from "svelte";
    import ControlPanel from "$lib/components/ControlPanel.svelte";
    import ImageGrid from "$lib/components/ImageGrid.svelte";
    import ImageViewModal from "$lib/components/ImageViewModal.svelte";
    import { persisted } from "$lib/model/persisted";
    import { sleepMs } from "$lib/util/sleepMs";
    import { ImageFeed } from "$lib/model/ImageFeed";
    import { Source, SourceExtractor } from "$lib/model/ImageSource";

    const columnCount = persisted("columnCount", 3);
    const showIndex = persisted("showIndex", false);
    const showNsfw = persisted("showNsfw", false);

    const minColumnWidth = 155;
    let clientWidth: number;
    $: maxColumnCount = Math.max(Math.floor(clientWidth / minColumnWidth), 1);

    export let imageSource: Source<unknown, unknown>;
    const sourceExtractor = new SourceExtractor(imageSource);
    const imageFeed = new ImageFeed(sourceExtractor);

    let openModal: (idx: number) => void;

    onMount(async () => {
        await tick();
        await imageFeed.fetchNext();
    });

    async function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;

        const scrolledToBottom = scrollTop + clientHeight >= scrollHeight - 100;

        if (scrolledToBottom) {
            await imageFeed.fetchNext();
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
    />

    <ImageViewModal {imageFeed} bind:openModal />

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
