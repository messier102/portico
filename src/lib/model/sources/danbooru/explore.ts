import type { Source } from "$lib/model/ImageSource";
import type { DanbooruResponse } from "./common";
import { isPage, parsePage } from "./common";

export class DanbooruExploreSource implements Source<number, DanbooruResponse> {
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

    isExhausted(page: DanbooruResponse): boolean {
        if (isPage(page)) {
            return page.length === 0;
        } else {
            return page.success === false;
        }
    }

    hasNextPage(): boolean {
        // We could check pageId < 1000, but that might break if we allow
        // linking upgraded accounts.
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
