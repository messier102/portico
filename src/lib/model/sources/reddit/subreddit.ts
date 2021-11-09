import { Source } from "$lib/model/ImageSource";
import { RedditResponse } from "./common";
import { getRedditPageUrl, parseRedditResponse } from "./common";

export class RedditSubredditSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;

    constructor(subreddit: string) {
        this.name = `r/${subreddit}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}.json`);
    }

    getPageUrl(pageId: string): URL {
        return getRedditPageUrl(this.baseUrl, pageId);
    }
    
    parseResponse = parseRedditResponse;
}
