import type { Source } from "$lib/model/ImageSource";
import { parsePage } from "./common";

export class RedditCustomFeedSource implements Source<number> {
    name: string;
    baseUrl: URL;
    initialPageId: number;

    constructor(readonly user: string, readonly feed: string) {
        this.name = `m/${user}/${feed}`;
        this.baseUrl = new URL(`https://www.reddit.com/${user}/m/${feed}.json`);
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
