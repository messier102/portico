<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruImageSource } from "$lib/model/sources/danbooru";

    $: tags = $page.params.tags;
    $: imageSource = new DanbooruImageSource(tags);
    $: sourceName = `Danbooru (${tags})`;
</script>

<ImageGallery {imageSource} {sourceName} />
