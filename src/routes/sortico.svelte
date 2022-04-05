<script lang="ts">
    import Swiper from "$lib/components/sortico/Swiper.svelte";
    import { RedditSubredditSource } from "$lib/model/sources/reddit/subreddit";
    const subreddit = "kemonomimi";
    const imageSource = new RedditSubredditSource(subreddit, "", "day");
</script>

<Swiper {imageSource} />
