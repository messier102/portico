<script lang="ts">
    import ImageGallery from "$lib/components/ImageGallery.svelte";
    import { HentsuDummySource } from "$lib/model/sources/hentsu/dummy";

    const imageSource = new HentsuDummySource(document.location.toString());
</script>

<ImageGallery {imageSource} />
