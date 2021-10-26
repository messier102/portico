<script lang="ts">
    import { page } from "$app/stores";

    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruImageSource } from "$lib/model/sources/danbooru";

    const date = $page.query.get("date");
    const scale = $page.query.get("scale");
    const imageSource = new DanbooruImageSource({
        type: "curated",
        date,
        scale: scale as "day" | "month" | "year",
    });
    const sourceName = "Danbooru curated";
</script>

<ImageGallery {imageSource} {sourceName} />
