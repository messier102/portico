<script lang="ts">
    import { Source } from "$lib/model/ImageSource";

    export let columnCount: number;
    export let maxColumnCount: number;
    export let showIndex: boolean;
    export let showNsfw: boolean;
    export let autoRotate: boolean;
    export let fullScreen: boolean;
    export let imageSource: Source<unknown, unknown>;

    let expandControlPanel: boolean = false;
    let cpHeaderHeight = 44;
    let cpTotalHeight = 250;
    $: cpBottom = expandControlPanel ? 0 : cpHeaderHeight - cpTotalHeight;

    $: columnCounts = [
        ...Array(!isNaN(maxColumnCount) ? maxColumnCount + 1 : 3).keys(),
    ].slice(1);
</script>

<div
    class="control-panel"
    style="height: {cpTotalHeight}px; bottom: {cpBottom}px"
>
    <div class="cp-header" style="height: {cpHeaderHeight}px;">
        <div class="cp-title">
            <input
                type="checkbox"
                id="expand-control-panel"
                bind:checked={expandControlPanel}
            />
            <label for="expand-control-panel" />

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

            <input type="checkbox" id="autorotate" bind:checked={autoRotate} />
            <label for="autorotate" />

            <input type="checkbox" id="nsfw" bind:checked={showNsfw} />
            <label for="nsfw" />

            <input type="checkbox" id="fullscreen" bind:checked={fullScreen} />
            <label for="fullscreen" />
        </div>
    </div>

    <div>
        <p>Various additional settings will go here.</p>
    </div>
</div>

<style>
    .control-panel {
        position: fixed;
        width: 100%;
        z-index: 2;
        display: flex;
        flex-flow: column nowrap;
        transition: all 0.4s ease-in-out;
        background-color: #222;
    }

    .cp-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #111;
    }

    .source-name {
        font-weight: 600;
        margin-bottom: 2px;
    }

    .cp-title {
        display: flex;
        align-items: center;
    }

    .quick-actions {
        padding-right: 8px;
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
        -webkit-mask-image: url("/nsfw.svg");
        mask-image: url("/nsfw.svg");
    }

    #nsfw:checked + label {
        background-color: gold;
    }

    #index + label {
        -webkit-mask-image: url("/index.svg");
        mask-image: url("/index.svg");
    }

    #index:checked + label {
        background-color: white;
    }

    #autorotate + label {
        -webkit-mask-image: url("/rotate-left.svg");
        mask-image: url("/rotate-left.svg");
    }

    #autorotate:checked + label {
        background-color: white;
    }

    #fullscreen + label {
        -webkit-mask-image: url("/fullscreen.svg");
        mask-image: url("/fullscreen.svg");
    }

    #fullscreen:checked + label {
        background-color: white;
    }

    #expand-control-panel + label {
        background-color: white;
        margin: 8px;
        -webkit-mask-image: url("/chevron-up.svg");
        mask-image: url("/chevron-up.svg");
        transition: transform 0.4s ease-in-out;
    }

    #expand-control-panel:checked + label {
        transform: rotate(180deg);
    }
</style>
