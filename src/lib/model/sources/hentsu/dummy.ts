import type { Source, SourceResponse, Image } from "$lib/model/ImageSource";
import type { StarredImage } from "./common";

export class HentsuDummySource implements Source<null, StarredImage[]> {
    name: string;
    baseUrl: URL;

    // `URL` constructor cannot produce relative URLs, so we have to get around
    // this by passing an absolute URL from the UI code explicitly.
    //
    // See https://github.com/whatwg/url/issues/531
    constructor(absoluteUrl: string) {
        this.name = "Hentsu dummy";
        this.baseUrl = new URL("/starboard.json", absoluteUrl);
    }

    getPageUrl(): URL {
        return new URL(this.baseUrl);
    }

    parseResponse(response: StarredImage[]): SourceResponse<null> {
        return {
            status: "success",
            images: response as Image[],
            nextPageId: null,
        };
    }
}
