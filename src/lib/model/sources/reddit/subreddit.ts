import type { Source } from "$lib/model/ImageSource";
import type { RedditResponse } from "./common";
import { getRedditPageUrl, parseRedditResponse } from "./common";

export class RedditSubredditSource implements Source<string, RedditResponse> {
    name: string;
    baseUrl: URL;

    constructor(subreddit: string) {
        this.name = `r/${subreddit}`;
        this.baseUrl = new URL(`https://www.reddit.com/r/${subreddit}.json`);
    }

    getPageUrl = getRedditPageUrl.bind(this);

    parseResponse = parseRedditResponse;
}
