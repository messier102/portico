import type { Source } from "$lib/model/ImageSource";
import type { RedditResponse } from "./common";
import { isListing, parsePage } from "./common";

export class RedditCustomFeedSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;
    initialPageId: string;

    constructor(readonly user: string, readonly feed: string) {
        this.name = `m/${user}/${feed}`;
        this.baseUrl = new URL(`https://www.reddit.com/${user}/m/${feed}.json`);
        this.initialPageId = null;
    }

    isExhausted(page: RedditResponse): boolean {
        if (isListing(page)) {
            return page.data.dist === 0;
        } else {
            return true;
        }
    }

    hasNextPage(page: RedditResponse): boolean {
        if (isListing(page)) {
            return page.data.after !== null;
        } else {
            return false;
        }
    }

    pageUrl(pageId?: string): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.set("after", String(pageId));
        return url;
    }

    nextPageId(pageId: string, page: RedditResponse): string {
        if (isListing(page)) {
            return page.data.after;
        } else {
            return null;
        }
    }

    parsePage = parsePage;
}
