<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditImageSource } from "$lib/model/sources/reddit";

    $: subreddit = $page.params.subreddit;
    $: imageSource = new RedditImageSource({ type: "subreddit", subreddit });
    $: sourceName = `r/${subreddit}`;
</script>

<ImageGallery {imageSource} {sourceName} />
