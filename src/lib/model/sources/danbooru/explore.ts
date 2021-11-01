import type { Source } from "$lib/model/ImageSource";
import type { DanbooruResponse } from "./common";
import { parseDanbooruResponse } from "./common";

export class DanbooruExploreSource implements Source<number, DanbooruResponse> {
    readonly name: string;
    readonly baseUrl: URL;

    constructor(
        type: "popular" | "curated" | "viewed",
        date?: string,
        scale?: "day" | "month" | "year"
    ) {
        this.name = `Danbooru ${type}`;
        this.baseUrl = new URL(
            `https://danbooru.donmai.us/explore/posts/${type}.json`
        );

        if (date) {
            this.baseUrl.searchParams.set("date", date);
        }
        if (scale) {
            this.baseUrl.searchParams.set("scale", scale);
        }
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);
        if (pageId) {
            url.searchParams.set("page", pageId.toString());
        }
        return url;
    }

    parseResponse = parseDanbooruResponse;
}
