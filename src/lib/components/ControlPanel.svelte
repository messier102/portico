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
        <div class="expand-dong">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-chevron-up"
                viewBox="0 0 16 16"
            >
                <path
                    fill-rule="evenodd"
                    d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
                />
            </svg>
        </div>
        <div class="foo">
            <div class="source-name">
                {imageSource.name}
            </div>
            <!-- <div class="column-count">
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
    -->
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
        width: 100%;
        align-items: center;
        height: 44px;
        background-color: #111;
    }

    .expand-dong {
        width: 42px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .source-name {
        font-weight: 600;
    }

    .foo {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
    }

    input[type="checkbox"] {
        display: none;
    }

    input[type="checkbox"] + label {
        width: 24px;
        height: 24px;
        mask-image: url("/nsfw.svg");
        background-color: rgba(255, 255, 255, 0.5);
        display: inline-block;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
    }

    input[type="checkbox"]:checked + label {
        background-color: gold;
    }

    /* select {
        margin: 0;
        border: none;
    } */
</style>
