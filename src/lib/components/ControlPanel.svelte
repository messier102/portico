<script lang="ts">
    import { Source } from "$lib/model/ImageSource";

    export let columnCount: number;
    export let maxColumnCount: number;
    export let showIndex: boolean;
    export let showNsfw: boolean;
    export let imageSource: Source<unknown, unknown>;

    $: columnCounts = [
        ...Array(!isNaN(maxColumnCount) ? maxColumnCount + 1 : 3).keys(),
    ].slice(1);
</script>

<div class="wrapper">
    <div class="control-panel">
        <div class="source-name">
            {imageSource.name}
        </div>
        <div class="column-count">
            <select bind:value={columnCount}>
                {#each columnCounts as count}
                    <option value={count}>{count}</option>
                {/each}
            </select>
        </div>

        <div class="index-switch">
            Index
            <input type="checkbox" bind:checked={showIndex} />
        </div>

        <div class="nsfw-switch">
            Show NSFW
            <input type="checkbox" bind:checked={showNsfw} />
        </div>
    </div>
</div>

<style>
    .wrapper {
        position: fixed;
        bottom: 0;
        width: 100vw;
        z-index: 2;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    .control-panel {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-evenly;
        height: 52px;
        background-color: #111;
    }

    .source-name {
        font-weight: 600;
    }

    select {
        margin: 0;
        border: none;
    }

    input {
        margin: 0;
    }
</style>
