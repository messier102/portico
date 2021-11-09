import { Source } from "$lib/model/ImageSource";
import { DanbooruResponse } from "./common";
import { parseDanbooruResponse } from "./common";

export class DanbooruExploreSource implements Source<number, DanbooruResponse> {
    readonly name: string;
    readonly baseUrl: URL;

    constructor(
        type: "popular" | "curated" | "viewed",
        date: string | null,
        scale: "day" | "month" | "year" | null
    ) {
        this.name = `Danbooru ${type}`;
        this.baseUrl = new URL(
            `https://danbooru.donmai.us/explore/posts/${type}.json`
        );

        if (date !== null) {
            this.baseUrl.searchParams.set("date", date);
        }
        if (scale !== null) {
            this.baseUrl.searchParams.set("scale", scale);
        }
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);
        if (pageId !== null) {
            url.searchParams.set("page", pageId.toString());
        }
        return url;
    }

    parseResponse = parseDanbooruResponse;
}
