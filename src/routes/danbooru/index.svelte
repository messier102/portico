<script lang="ts">
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruImageSource } from "$lib/model/sources/danbooru";

    const imageSource = new DanbooruImageSource();
    const sourceName = "Danbooru popular";
</script>

<ImageGallery {imageSource} {sourceName} />
