<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { DanbooruPostsSource } from "$lib/model/sources/danbooru/posts";

    const tags = $page.query.get("tags");
    const random = $page.query.has("random");
    const imageSource = new DanbooruPostsSource(tags, random);
</script>

<ImageGallery {imageSource} />
