<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditImageSource } from "$lib/model/sources/reddit";

    $: user = $page.params.user;
    $: feed = $page.params.feed;
    $: imageSource = new RedditImageSource({ type: "custom-feed", user, feed });
    $: sourceName = `m/${user}/${feed}`;
</script>

<!-- <ImageGallery {imageSource} {sourceName} /> -->
