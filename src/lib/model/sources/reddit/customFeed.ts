import { Source } from "$lib/model/ImageSource";
import { RedditResponse } from "./common";
import { getRedditPageUrl, parseRedditResponse } from "./common";

export class RedditCustomFeedSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;

    constructor(user: string, feed: string, subfeed: string, scale: string = "day") {
        this.name = `r/${user}/${feed} ${subfeed} ${subfeed === "top" ? `(${scale})` : ""}`;
        this.baseUrl = new URL(`https://www.reddit.com/user/${user}/m/${feed}/${subfeed}.json`);

        if (subfeed === "top") {
            this.baseUrl.searchParams.set("t", scale);
        }
    }

    getPageUrl(pageId: string): URL {
        return getRedditPageUrl(this.baseUrl, pageId);
    }

    parseResponse = parseRedditResponse;
}
