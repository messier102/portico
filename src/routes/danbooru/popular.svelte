<script lang="ts">
    import { page } from "$app/stores";

    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruImageSource } from "$lib/model/sources/danbooru";

    const date = $page.query.get("date");
    const scale = $page.query.get("scale");
    const imageSource = new DanbooruImageSource({
        type: "popular",
        date,
        scale: scale as "day" | "month" | "year",
    });
    const sourceName = "Danbooru popular";
</script>

<ImageGallery {imageSource} {sourceName} />
