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

export class RedditImageSource implements ImageSource {
    private after: string = null;
    private exhausted: boolean = false;
    private baseUrl: string;

    // TODO: Rewrite in a more general way.
    constructor(subredditOrUsername: string, feedname?: string) {
        if (feedname) {
            this.baseUrl = `https://www.reddit.com/user/${subredditOrUsername}/m/${feedname}`;
        } else {
            this.baseUrl = `https://www.reddit.com/r/${subredditOrUsername}`;
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
