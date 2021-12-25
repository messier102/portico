<script lang="ts">
    import { page } from "$app/stores";

    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruExploreSource } from "$lib/model/sources/danbooru/explore";

    const date = $page.query.get("date");

    // `/viewed` board does not support the `scale` parameter, always set to day
    const imageSource = new DanbooruExploreSource("viewed", date, null);
</script>

<ImageGallery {imageSource} />
