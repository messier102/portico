<script lang="ts">
    import type { StarredImage } from "../model/ImageSource";

    export let starred: StarredImage;
    export let showNsfw: boolean;
    export let idx: number;
    export let loadedIdx: number;
    export let showIndex: boolean;

    let imageLoaded = false;
</script>

<div class="tile" on:click>
    <img
        class="content"
        class:loaded={imageLoaded}
        class:nsfw={!showNsfw && starred.isNsfw}
        src={starred.imageUrl}
        alt={starred.name}
        on:load={() => (imageLoaded = true)}
    />

    {#if showIndex}
        <h1 class="index">
            {idx}/{loadedIdx}
        </h1>
    {/if}

    <div class="overlay">
        <p>{starred.name}</p>
    </div>
</div>

<style>
    .index {
        grid-area: 1 / 1;
        font-size: 100px;
        text-shadow: 0 0 5px black;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    img {
        width: 100%;
        opacity: 0;
        transition: 1s ease;
        background-color: #223;
    }

    .loaded {
        opacity: 1;
    }

    .nsfw {
        filter: brightness(0.7) blur(32px);
    }

    p {
        position: sticky;
        bottom: 0;
        margin: 0;
        padding-right: 10px;
        padding-bottom: 8px;
        padding-top: 4px;
        font-size: 1.3em;
        text-shadow: 0 0 4px black;
        overflow: hidden;
    }

    .tile {
        position: relative;
        display: inline-grid;
        grid-template: 1fr / 1fr;
        cursor: pointer;
        width: 100%;
        margin-bottom: 4px;
        /* Overflow is set to clip instead of hidden 
        to preserve the sticky behavior of the image title.
        See https://github.com/w3c/csswg-drafts/issues/865 */
        overflow: clip;
        background-color: #223;
    }

    .content,
    .overlay {
        grid-area: 1 / 1;
    }

    .overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        overflow-wrap: anywhere;
    }

    .tile:hover .overlay {
        opacity: 1;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 0 10px;

        background-color: rgba(0, 0, 0, 0.4);
        transition: 0.3s ease;
    }
</style>
