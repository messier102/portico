import { Source } from "$lib/model/ImageSource";
import { RedditResponse } from "./common";
import { getRedditPageUrl, parseRedditResponse } from "./common";

export class RedditSubredditSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;

    constructor(subreddit: string, feed: string, scale: string = "day") {
        this.name = `r/${subreddit} ${feed} ${`(${scale})` ?? ""}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}/${feed}.json`);
        
        if (feed === "top") {
            this.baseUrl.searchParams.set("t", scale);
        }
    }

    getPageUrl(pageId: string): URL {
        return getRedditPageUrl(this.baseUrl, pageId);
    }
    
    parseResponse = parseRedditResponse;
}
