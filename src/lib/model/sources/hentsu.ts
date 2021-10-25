import type { ImageSource, StarredImage } from "../ImageSource";

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
