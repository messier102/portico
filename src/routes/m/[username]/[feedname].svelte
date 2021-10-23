<script lang="ts">
    import { page } from "$app/stores";
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { RedditImageSource } from "$lib/model/ImageSource";

    $: username = $page.params.username;
    $: feedname = $page.params.feedname;
    $: imageSource = new RedditImageSource(username, feedname);
    $: sourceName = `m/${username}/${feedname}`;
</script>

<ImageGallery {imageSource} {sourceName} />
