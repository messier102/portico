import type { ImageSource, StarredImage } from "../ImageSource";

export class DanbooruImageSource implements ImageSource {
    private page = 1;
    private baseUrl: string;

    constructor(private readonly tags?: string) {
        if (tags) {
            this.baseUrl = `https://danbooru.donmai.us/posts.json`;
        } else {
            this.baseUrl = `https://danbooru.donmai.us/explore/posts/popular.json`;
        }
    }

    async fetchNextPage(): Promise<StarredImage[]> {
        const params = new URLSearchParams({
            page: this.page.toString(),
        });

        if (this.tags) {
            params.append("tags", this.tags);
        }

        const res = await fetch(this.baseUrl + "?" + params);
        const page = await res.json();

        const images = page
            .filter((item) => item.file_url !== null)
            .map((item) => ({
                name: item.md5,
                imageUrl: item.file_url,
                isNsfw: item.rating === "e" || item.rating === "q",
            }));

        this.page++;

        return images;
    }

    reset(): void {
        this.page = 1;
    }
}
