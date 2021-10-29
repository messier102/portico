import type { Source } from "$lib/model/ImageSource";
import type { RedditResponse } from "./common";
import { isListing, parsePage } from "./common";

export class RedditSubredditSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;
    initialPageId: string;

    constructor(readonly subreddit: string) {
        this.name = `r/${subreddit}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}.json`);
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
