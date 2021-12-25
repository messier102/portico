<script lang="ts">
    import { page } from "$app/stores";

    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruExploreSource } from "$lib/model/sources/danbooru/explore";

    const date = $page.query.get("date");
    const scale = $page.query.get("scale");

    const imageSource = new DanbooruExploreSource(
        "curated",
        date,
        scale as "day" | "week" | "month"
    );
</script>

<ImageGallery {imageSource} />
