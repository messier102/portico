import { Source } from "$lib/model/ImageSource";
import { DanbooruResponse } from "./common";
import { parseDanbooruResponse } from "./common";

export class DanbooruPostsSource implements Source<number, DanbooruResponse> {
    readonly name: string;
    readonly baseUrl: URL;

    constructor(tags: string | null, readonly random: boolean | null) {
        this.name = "Danbooru posts";
        this.baseUrl = new URL(`https://danbooru.donmai.us/posts.json`);

        if (tags !== null) {
            this.baseUrl.searchParams.set("tags", tags);
        }
        if (random ?? false) {
            this.baseUrl.searchParams.set("random", "true");
        }
    }

    getPageUrl(pageId: number | null): URL {
        const url = new URL(this.baseUrl);

        // Setting the `page` parameter causes Danbooru to aggressively cache
        // the randomized response, returning 304 on subsequent requests.
        if (!(this.random ?? false) && pageId !== null) {
            url.searchParams.set("page", pageId.toString());
        }

        return url;
    }

    parseResponse = parseDanbooruResponse;
}
