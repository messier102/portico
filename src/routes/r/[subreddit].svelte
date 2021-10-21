<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditImageSource } from "$lib/model/ImageSource";

    $: subreddit = $page.params.subreddit;
    $: imageSource = new RedditImageSource(subreddit);
    $: sourceName = `Top of r/${subreddit}`;
</script>

<ImageGallery {imageSource} {sourceName} />
