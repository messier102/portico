import type { ImageSource, StarredImage } from "../ImageSource";

export type DanbooruSource = Posts | Explore;

export type Posts = {
    type: "posts";
    tags?: string;
    random?: boolean;
};

export type Explore = {
    type: "popular" | "curated" | "viewed";
    date?: string;
    scale?: "day" | "month" | "year";
};

export class DanbooruImageSource implements ImageSource {
    private page = 1;
    private baseUrl: string;
    private params = new URLSearchParams();

    constructor(source: DanbooruSource) {
        if (source.type === "posts") {
            this.baseUrl = `https://danbooru.donmai.us/posts.json`;
            if (source.tags) {
                this.params.append("tags", source.tags);
            }
            if (source.random) {
                this.params.append("random", "true");
            }
        } else {
            this.baseUrl = `https://danbooru.donmai.us/explore/posts/${source.type}.json`;
            if (source.date) {
                this.params.append("date", source.date);
            }
            if (source.scale) {
                this.params.append("scale", source.scale);
            }
        }
    }

    async fetchNextPage(): Promise<StarredImage[]> {
        // Setting the page parameter causes Danbooru to aggressively cache
        // the randomized response, returning 304 on subsequent requests.
        if (!this.params.has("random")) {
            this.params.set("page", this.page.toString());
        }

        const res = await fetch(this.baseUrl + "?" + this.params);
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
