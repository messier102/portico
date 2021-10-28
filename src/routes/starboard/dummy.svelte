<script lang="ts">
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { StarboardImageSource } from "$lib/model/sources/hentsu";

    $: imageSource = new StarboardImageSource("/starboard.json");
    const sourceName = "Hentsu Starboard (dummy)";
</script>

<!-- <ImageGallery {imageSource} {sourceName} /> -->
