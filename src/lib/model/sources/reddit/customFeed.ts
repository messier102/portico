import type { Source } from "$lib/model/ImageSource";
import { parsePage } from "./common";

export class RedditCustomFeedSource implements Source<string> {
    name: string;
    baseUrl: URL;
    initialPageId: string;

    constructor(readonly user: string, readonly feed: string) {
        this.name = `m/${user}/${feed}`;
        this.baseUrl = new URL(`https://www.reddit.com/${user}/m/${feed}.json`);
        this.initialPageId = null;
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
