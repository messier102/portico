import type { Source } from "$lib/model/ImageSource";
import { parsePage } from "./common";

export class RedditSubredditSource implements Source<string> {
    name: string;
    baseUrl: URL;
    initialPageId: string;

    constructor(readonly subreddit: string) {
        this.name = `r/${subreddit}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}.json`);
        this.initialPageId = null;
    }

    isExhausted(page: unknown): boolean {
        return (page as any).data.dist === 0;
    }

    hasNextPage(page: unknown): boolean {
        return (page as any).data.after !== null;
    }

    pageUrl(pageId?: string): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.set("after", String(pageId));
        return url;
    }

    nextPageId(pageId: string, page: unknown): string {
        return (page as any).data.after;
    }

    parsePage = parsePage;
}
