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
        <div class="bar">
            <img class="expand-dong" src="/chevron-up.svg" alt="Expand menu" />

            <div class="source-name">
                {imageSource.name}
            </div>
        </div>

        <div class="quick-actions">
            <select bind:value={columnCount}>
                {#each columnCounts as count}
                    <option value={count}>{count}</option>
                {/each}
            </select>

            <input type="checkbox" id="index" bind:checked={showIndex} />
            <label for="index" />

            <input type="checkbox" id="nsfw" bind:checked={showNsfw} />
            <label for="nsfw" />
        </div>
    </div>
</div>

<style>
    .wrapper {
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 2;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    .control-panel {
        display: flex;
        padding-right: 8px;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        height: 44px;
        background-color: #111;
    }

    .expand-dong {
        width: 24px;
        margin: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: invert();
    }

    .source-name {
        font-weight: 600;
        margin-bottom: 2px;
    }

    .bar {
        display: flex;
        align-items: center;
    }

    .quick-actions {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 12px;
    }

    select {
        margin: 0;
        height: 44px;
        width: 44px;
        background-color: #222;
        border: none;
        border-radius: 0;
    }

    input[type="checkbox"] {
        display: none;
    }

    input[type="checkbox"] + label {
        width: 24px;
        height: 24px;
        background-color: rgba(255, 255, 255, 0.5);
        display: inline-block;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }

    #nsfw + label {
        mask-image: url("/nsfw.svg");
    }

    #nsfw:checked + label {
        background-color: gold;
    }

    #index + label {
        mask-image: url("/index.svg");
    }

    #index:checked + label {
        background-color: white;
    }
</style>
