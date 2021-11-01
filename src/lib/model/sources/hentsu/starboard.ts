import type { Source, SourceResponse, Image } from "$lib/model/ImageSource";
import type { StarredImage } from "./common";

export class HentsuStarboardSource implements Source<number, StarredImage[]> {
    name: string;
    baseUrl: URL;

    constructor(readonly startingTimestamp?: number) {
        this.name = "Hentsu starboard";
        this.baseUrl = new URL(
            "https://starboard-9xp4qxvm.ew.gateway.dev/v1/starred"
        );
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);
        if (pageId) {
            url.searchParams.set("olderThan", pageId.toString());
        }
        return url;
    }

    parseResponse(response: StarredImage[]): SourceResponse<number> {
        if (response.length === 0) {
            return { status: "exhausted" };
        }

        return {
            status: "success",
            images: response as Image[],
            nextPageId: response[response.length - 1].starredAt,
        };
    }
}
