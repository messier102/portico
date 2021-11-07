<script lang="ts">
    export let columnCount: number;
    export let maxColumnCount: number;
    export let showIndex: boolean;
    export let showNsfw: boolean;

    $: columnCounts = [
        ...Array(!isNaN(maxColumnCount) ? maxColumnCount + 1 : 3).keys(),
    ].slice(1);
</script>

<div class="wrapper">
    <div class="control-panel">
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
        bottom: 12px;
        width: 100%;
        z-index: 2;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }

    @media screen and (min-width: 720px) {
        .wrapper {
            right: 30px;
            justify-content: right;
        }

        .control-panel {
            opacity: 0.7;
        }
    }

    .control-panel {
        padding: 0 8px;
        display: flex;
        align-items: center;
        border-radius: 12px;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
        height: 52px;
        background-color: #223;
        transition: 0.2s ease;
        gap: 8px;
    }

    .control-panel:hover {
        opacity: 1;
    }

    select {
        margin: 0;
        border-radius: 10px;
        color: white;
        background-color: #334;
        border: none;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    input {
        margin: 0;
    }
</style>
