<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { HentsuStarboardSource } from "$lib/model/sources/hentsu/starboard";

    const query = $page.query;
    const before = query.get("before");
    const startingTimestamp = before !== null ? Number.parseInt(before) : null;

    const starredBy = query.get("starredBy");

    const imageSource = new HentsuStarboardSource(startingTimestamp, starredBy);
</script>

<ImageGallery {imageSource} />
