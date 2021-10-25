import type { ImageSource, StarredImage } from "../ImageSource";

// TODO: Come up with a better name.
export type RedditSource = Subreddit | CustomFeed;

export type Subreddit = {
    type: "subreddit";
    subreddit: string;
};

export type CustomFeed = {
    type: "custom-feed";
    user: string;
    feed: string;
};

export class RedditImageSource implements ImageSource {
    private after: string = null;
    private exhausted: boolean = false;
    private baseUrl: string;

    constructor(source: RedditSource) {
        if (source.type === "subreddit") {
            this.baseUrl = `https://www.reddit.com/r/${source.subreddit}`;
        } else {
            this.baseUrl = `https://www.reddit.com/user/${source.user}/m/${source.feed}`;
        }
    }

    async fetchNextPage(): Promise<StarredImage[]> {
        if (this.exhausted) {
            return [];
        }

        const endpoint = this.baseUrl + `.json?after=${this.after}`;
        const res = await fetch(endpoint);
        const listing = await res.json();

        if (listing.data.after === null) {
            this.exhausted = true;
        }

        const images = listing.data.children.map(({ data }) => ({
            name: data.title,
            imageUrl: data.url,
            isNsfw: data.over_18,
        }));

        this.after = listing.data.after;

        return images;
    }

    reset(): void {
        this.after = null;
        this.exhausted = false;
    }
}
