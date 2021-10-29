import type { Source } from "$lib/model/ImageSource";
import type { DanbooruResponse } from "./common";
import { isPage, parsePage } from "./common";

export class DanbooruPostsSource implements Source<number, DanbooruResponse> {
    readonly name: string;
    readonly baseUrl: URL;
    readonly initialPageId: number = 1;

    constructor(readonly tags?: string, readonly random?: boolean) {
        this.name = "Danbooru posts";
        this.baseUrl = new URL(`https://danbooru.donmai.us/posts.json`);

        if (tags) {
            this.baseUrl.searchParams.set("tags", tags);
        }
        if (random) {
            this.baseUrl.searchParams.set("random", "true");
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

    pageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);

        // Setting the `page` parameter causes Danbooru to aggressively cache
        // the randomized response, returning 304 on subsequent requests.
        if (!this.random && pageId) {
            url.searchParams.set("page", pageId.toString());
        }

        return url;
    }

    nextPageId(pageId: number | null): number | null {
        return this.random ? null : pageId + 1;
    }

    parsePage = parsePage;
}
