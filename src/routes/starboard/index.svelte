<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { HentsuStarboardSource } from "$lib/model/sources/hentsu/starboard";

    const query = $page.query;
    const startingTimestamp = query.has("before")
        ? Number.parseInt(query.get("before"))
        : null;

    const imageSource = new HentsuStarboardSource(startingTimestamp);
</script>

<ImageGallery {imageSource} />
