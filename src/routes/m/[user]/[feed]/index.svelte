<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditCustomFeedSource } from "$lib/model/sources/reddit/customFeed";

    const user = $page.params.user;
    const feed = $page.params.feed;
    const imageSource = new RedditCustomFeedSource(user, feed, "new");
</script>

<ImageGallery {imageSource} />
