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

    isExhausted(page: unknown): boolean {
        return (
            (page as unknown[]).length === 0 || (page as any).success === false
        );
    }

    hasNextPage(page: unknown): boolean {
        return true;
    }

    pageUrl(pageId: number): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.set("page", pageId.toString());
        return url;
    }

    nextPageId(pageId: number): number {
        return pageId + 1;
    }

    parsePage = parsePage;
}
