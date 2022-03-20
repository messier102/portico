<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditSubredditSource } from "$lib/model/sources/reddit/subreddit";

    const subreddit = $page.params.subreddit;
    const imageSource = new RedditSubredditSource(subreddit, "hot");
</script>

<ImageGallery {imageSource} />
