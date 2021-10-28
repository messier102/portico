import type { Source } from "$lib/model/ImageSource";
import { parsePage } from "./common";

export class DanbooruExploreSource implements Source<number> {
    readonly name: string;
    readonly baseUrl: URL;
    readonly initialPageId: number = 1;

    constructor(
        readonly type: "popular" | "curated" | "viewed",
        readonly date?: string,
        readonly scale?: "day" | "month" | "year"
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

    pageUrl(pageId: number): [URL, number] {
        const url = new URL(this.baseUrl);
        url.searchParams.set("page", pageId.toString());

        return [url, pageId + 1];
    }

    parsePage = parsePage;
}
