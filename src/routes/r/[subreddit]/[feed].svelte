<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditSubredditSource } from "$lib/model/sources/reddit/subreddit";

    const subreddit = $page.params.subreddit;
    const feed = $page.params.feed;
    const scale = $page.query.get("t") ?? "day";
    const imageSource = new RedditSubredditSource(subreddit, feed, scale);
</script>

<ImageGallery {imageSource} />
