<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditImageSource } from "$lib/model/ImageSource";

    $: subreddit = $page.params.subreddit;
    $: imageSource = new RedditImageSource({ type: "subreddit", subreddit });
    $: sourceName = `r/${subreddit}`;
</script>

<ImageGallery {imageSource} {sourceName} />
