import { Source, SourceResponse, InternalImage } from "$lib/model/ImageSource";
import { StarredImage } from "./common";

export class HentsuStarboardSource implements Source<number, StarredImage[]> {
    name: string;
    baseUrl: URL;

    constructor(
        readonly startingTimestamp: number | null,
        readonly starredBy: string | null
    ) {
        this.name = "Hentsu starboard";
        this.baseUrl = new URL(
            "https://hentsu.tskoll.com/api/v1/starboard/starred"
        );
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);

        if (pageId !== null || this.startingTimestamp !== null) {
            const timestamp = (pageId ?? this.startingTimestamp) as number;
            url.searchParams.set("olderThan", timestamp.toString());
        }

        if (this.starredBy !== null) {
            url.searchParams.set("starredBy", this.starredBy);
        }

        return url;
    }

    parseResponse(response: StarredImage[]): SourceResponse<number> {
        if (response.length === 0) {
            return { status: "exhausted" };
        }

        const images: InternalImage[] = response.map(
            (image) =>
                ({
                    name: image.name,
                    imageUrl: image.imageUrl,
                    isNsfw: true,
                } as InternalImage)
        );

        return {
            status: "success",
            images,
            nextPageId: response[response.length - 1].starredAt,
        };
    }
}
