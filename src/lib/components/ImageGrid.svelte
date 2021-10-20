<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { AnnotatedImage } from "../model/ImageFeed";
    import ImageTile from "./ImageTile.svelte";
    import { fly } from "svelte/transition";

    const dispatch = createEventDispatcher();

    export let images: AnnotatedImage[];
    export let columnCount: number;
    export let showIndex: boolean;
    export let showNsfw: boolean;

    $: columns = computeLayout(columnCount, images);

    function computeLayout(columnCount: number, images: AnnotatedImage[]) {
        // A simple partitioning algorithm that places each image in sequence
        // into the shortest available column. The goal is to preserve sequential locality:
        // images that are close in sequence should be close together visually on the page.
        //
        // TODO: Improve the algorithm to favor left-to-right ordering where possible.

        const columns = Array.from(Array(columnCount), () => []);
        const columnHeights = Array.from(columns, () => 0);

        // Scale all images to the same width to make heights comparable.
        const scaledImageWidth = 1000;

        for (const image of images) {
            if (!image) continue;

            const { img, starred, idx, loadedIdx } = image;

            const indexOfShortestColumn = columnHeights.indexOf(
                Math.min.apply(Math, columnHeights)
            );

            const scaleFactor = scaledImageWidth / img.width;
            const scaledImageHeight = img.height * scaleFactor;

            columns[indexOfShortestColumn].push({ starred, idx, loadedIdx });
            // TODO: This might cause overflow issues.
            columnHeights[indexOfShortestColumn] += scaledImageHeight;
        }

        return columns;
    }
</script>

<div
    class="grid"
    style="grid-template-columns: repeat({columnCount}, minmax(0, 1fr));"
>
    {#each columns as column}
        <div class="column">
            {#each column as { starred, idx, loadedIdx } (loadedIdx)}
                <div
                    class="wrapper"
                    in:fly={{
                        y: 120 / columnCount,
                        duration: 1000,
                    }}
                >
                    <ImageTile
                        {starred}
                        {showNsfw}
                        on:click={() => dispatch("select", loadedIdx)}
                    />
                    <h1 class:enabled={showIndex}>{idx}/{loadedIdx}</h1>
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        gap: 4px;
    }

    .wrapper {
        position: relative;
    }

    h1 {
        visibility: hidden;
        pointer-events: none;
        font-size: 100px;
        text-shadow: 0 0 5px black;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    h1.enabled {
        visibility: visible;
    }
</style>
