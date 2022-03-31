<script lang="ts">
    import { onMount } from "svelte";
    import { InternalImage } from "../model/ImageSource";

    export let starred: InternalImage;
    export let showNsfw: boolean;
    export let idx: number;
    export let loadedIdx: number;
    export let showIndex: boolean;

    let image: HTMLImageElement;
    let imageLoaded = false;

    onMount(async () => {
        await image.decode();
        imageLoaded = true;
    });
</script>

<div class="tile" on:click>
    <!-- Element order is significant (determines z-index) -->
    <img
        bind:this={image}
        class:hidden={!imageLoaded}
        class:blurred={!showNsfw && starred.isNsfw}
        src={starred.imageUrl}
        alt={starred.name}
    />

    {#if showIndex}
        <h1 class="index overlay">
            {idx}/{loadedIdx}
        </h1>
    {/if}

    <div class="title overlay">
        <p>{starred.name}</p>
    </div>
</div>

<style>
    .tile {
        position: relative;
        background-color: #222; /* for placeholder */
        cursor: pointer;
        /* Overflow is set to clip to preserve the sticky behavior of the image title.
        See https://github.com/w3c/csswg-drafts/issues/865 */
        overflow: clip;
    }

    .overlay {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    img {
        /* Remove the gap between images due to inline display respecting whitespace.
        See https://stackoverflow.com/q/19038799 */
        display: block;
        width: 100%;
        transition: opacity 1s ease, filter 1s ease;
    }

    img.hidden {
        opacity: 0;
    }

    img.blurred {
        filter: brightness(0.7) blur(32px);
    }

    .index {
        font-size: 48px;
        text-shadow: 0 0 5px black;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        background-color: rgba(0, 0, 0, 0.4);

        opacity: 0;
        transition: 0.3s ease;
    }

    .title:hover {
        opacity: 1;
    }

    .title p {
        position: sticky;
        bottom: 0;

        width: calc(100% - 20px);
        margin: 0;
        padding-right: 10px;
        padding-bottom: 8px;
        padding-top: 4px;

        font-size: 1.3rem;
        text-shadow: 0 0 5px black;
        overflow-wrap: anywhere;

        transition: padding-left 0.3s ease;
    }

    .title:hover p {
        /* Slide-in effect */
        padding-left: 10px;
    }
</style>
