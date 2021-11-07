import type { Source, SourceResponse, Image } from "$lib/model/ImageSource";
import type { StarredImage } from "./common";

export class HentsuStarboardSource implements Source<number, StarredImage[]> {
    name: string;
    baseUrl: URL;

    constructor(readonly startingTimestamp: number | null) {
        this.name = "Hentsu starboard";
        this.baseUrl = new URL(
            "https://starboard-9xp4qxvm.ew.gateway.dev/v1/starred"
        );
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);

        if (pageId !== null || this.startingTimestamp !== null) {
            const timestamp = (pageId ?? this.startingTimestamp) as number;
            url.searchParams.set("olderThan", timestamp.toString());
        }

        return url;
    }

    parseResponse(response: StarredImage[]): SourceResponse<number> {
        if (response.length === 0) {
            return { status: "exhausted" };
        }

        const images: Image[] = response.map(
            (image) =>
                ({
                    name: image.name,
                    imageUrl: image.imageUrl,
                    isNsfw: true,
                } as Image)
        );

        return {
            status: "success",
            images,
            nextPageId: response[response.length - 1].starredAt,
        };
    }
}
