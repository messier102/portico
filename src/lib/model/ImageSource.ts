export type StarredImage = {
    name: string;
    imageUrl: string;
    directUrl: string;
    starredBy: string;
    starredAt: number;
    isNsfw: boolean;
};

export interface ImageSource {
    fetchNextPage(): Promise<StarredImage[]>;
    reset(): void;
}

export class StarboardImageSource implements ImageSource {
    private exhausted: boolean = false;

    constructor(
        private readonly endpointUrl: string,
        private lastFetchedImageTimestamp: number = null
    ) {}

    async fetchNextPage(): Promise<StarredImage[]> {
        if (this.exhausted) {
            return [];
        }

        const moreImages = await fetchStarboard(
            this.endpointUrl,
            this.lastFetchedImageTimestamp
        );

        if (moreImages.length === 0) {
            this.exhausted = true;
            return [];
        }

        this.lastFetchedImageTimestamp =
            moreImages[moreImages.length - 1].starredAt;

        return moreImages;
    }

    reset(): void {
        // TODO: could calling reset during fetchNextPage cause issues?
        this.lastFetchedImageTimestamp = null;
        this.exhausted = false;
    }
}

async function fetchStarboard(
    starboardUrl: string,
    lastImage: number
): Promise<StarredImage[]> {
    const res = await fetch(
        starboardUrl + (lastImage ? `?olderThan=${lastImage}` : "")
    );
    const starredImages = await res.json();

    return starredImages.map((i) => ({ isNsfw: true, ...i }));
}

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
