<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { AnnotatedImage } from "../model/ImageFeed";
    import ImageTile from "./ImageTile.svelte";
    import { fly } from "svelte/transition";

    const dispatch = createEventDispatcher();

    export let images: AnnotatedImage[];
    export let columnCount: number;
    export let showIndex: boolean;
    export let showNsfw: boolean;

    $: columns = computeLayout(columnCount, images);

    function computeLayout(columnCount: number, images: AnnotatedImage[]) {
        const columns: (AnnotatedImage & { row: number })[][] = Array.from(
            Array(columnCount),
            () => []
        );
        const columnHeights = Array.from(columns, () => 0);

        // Scale all images to the same width to make heights comparable.
        const scaledImageWidth = 1000;

        let nextColumnIdx = 0;
        let row = 0;
        let firstImageHeight = 0;

        for (const image of images) {
            if (image === null) continue;

            const { img } = image;

            const scaleFactor = scaledImageWidth / img.width;
            const scaledImageHeight = img.height * scaleFactor;

            const [firstCol, leftCol, centerCol, rightCol] = [
                0,
                nextColumnIdx - 1,
                nextColumnIdx,
                nextColumnIdx + 1,
            ];

            if (nextColumnIdx !== 0) {
                firstImageHeight = scaledImageHeight;
            }

            // if current column has overtaken right column or is the rightmost column, consider switching
            if (
                centerCol === columnCount - 1 ||
                columnHeights[centerCol] >=
                    columnHeights[rightCol] + scaledImageHeight * 0.1
            ) {
                if (
                    // if current column has overtaken first column
                    columnHeights[centerCol] >= columnHeights[firstCol] ||
                    // if less than half of the image can fit into the current column
                    (columnHeights[firstCol] - columnHeights[centerCol] <=
                        scaledImageHeight * 0.5 &&
                        columnHeights[firstCol] - columnHeights[centerCol] <=
                            firstImageHeight * 0.5)
                ) {
                    nextColumnIdx = (nextColumnIdx + 1) % columnCount;
                    if (nextColumnIdx === 0) {
                        row++;
                    }
                }
            }

            columns[nextColumnIdx].push({ row, ...image });
            columnHeights[nextColumnIdx] += scaledImageHeight;
        }

        return columns;
    }
</script>

<div
    class="grid"
    style="grid-template-columns: repeat({columnCount}, minmax(0, 1fr));"
>
    {#each columns as column, columnId}
        <div class="column">
            {#each column as { starred, idx, loadedIdx, row } (loadedIdx)}
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
                        {idx}
                        {loadedIdx}
                        {showIndex}
                        on:click={() => dispatch("select", loadedIdx)}
                    />

                    {#if columnId === 0}
                        <div
                            class="row-line"
                            style={`background-color:
                            hsl(${row * 60}, 100%, 50%)`}
                        />
                    {/if}

                    <div
                        class="colorizer"
                        style={`background-color: hsl(${row * 60}, 100%, 50%)`}
                    />
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

    .column {
        display: flex;
        flex-flow: column nowrap;
        gap: 4px;
    }

    .wrapper {
        position: relative;
    }

    .colorizer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.6;
    }

    .row-line {
        position: absolute;
        z-index: 9999;
        width: 98vw;
        height: 3px;
        border: 2px solid black;
    }
</style>
