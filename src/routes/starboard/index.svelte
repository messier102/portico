<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { StarboardImageSource } from "$lib/model/sources/hentsu";

    $: query = $page.query;
    $: startingTimestamp = query.has("before")
        ? Number.parseInt(query.get("before"))
        : null;

    $: imageSource = new StarboardImageSource(
        "https://starboard-9xp4qxvm.ew.gateway.dev/v1/starred",
        startingTimestamp
    );

    $: sourceName =
        "Hentsu Starboard" +
        (startingTimestamp ? ` (before ${startingTimestamp}` : "");
</script>

<!-- <ImageGallery {imageSource} {sourceName} /> -->
