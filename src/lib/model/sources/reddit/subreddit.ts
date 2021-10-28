import type { Source } from "$lib/model/ImageSource";
import { parsePage } from "./common";

export class RedditSubredditSource implements Source<number> {
    name: string;
    baseUrl: URL;
    initialPageId: number;

    constructor(readonly subreddit: string) {
        this.name = `r/${subreddit}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}.json`);
        this.initialPageId = null;
    }

    pageUrl(pageId?: number): [URL, number] {
        const url = new URL(this.baseUrl);
        url.searchParams.set("after", String(pageId));
        
        // FIXME: oops, can't return next pageId before downloading the page
        // :facepalm:
        return [url, pageId];
    }

    parsePage = parsePage;
}
