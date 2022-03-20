<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditCustomFeedSource } from "$lib/model/sources/reddit/customFeed";

    const user = $page.params.user;
    const feed = $page.params.feed;
    const subfeed = $page.params.subfeed;
    const scale = $page.query.get("t") ?? "day";
    const imageSource = new RedditCustomFeedSource(user, feed, subfeed, scale);
</script>

<ImageGallery {imageSource} />
