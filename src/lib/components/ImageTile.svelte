<script lang="ts">
    import type { StarredImage } from "../model/ImageSource";

    export let starred: StarredImage;
    export let showNsfw: boolean;

    let imageLoaded = false;
</script>

<div class="tile" on:click>
    {#if !imageLoaded}
        <div class="placeholder" />
    {/if}

    <img
        class="content"
        class:loaded={imageLoaded}
        class:nsfw={!showNsfw && starred.isNsfw}
        src={starred.imageUrl}
        alt={starred.name}
        on:load={() => (imageLoaded = true)}
    />
    <div class="overlay">
        <p>{starred.name}</p>
    </div>
</div>

<style>
    .placeholder {
        background-color: #223;
        width: 100%;
        height: 100%;
        grid-area: 1 / 1;
    }

    img {
        width: 100%;
        opacity: 0;
        transition: 1s ease;
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
        overflow: hidden;
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
