import { Source } from "$lib/model/ImageSource";
import { RedditResponse } from "./common";
import { getRedditPageUrl, parseRedditResponse } from "./common";

export class RedditCustomFeedSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;

    constructor(user: string, feed: string) {
        this.name = `r/${user}/${feed}`;
        this.baseUrl = new URL(`https://www.reddit.com/user/${user}/m/${feed}/new.json`);
    }

    getPageUrl(pageId: string): URL {
        return getRedditPageUrl(this.baseUrl, pageId);
    }

    parseResponse = parseRedditResponse;
}
