import type { Source, StarredImage } from "$lib/model/ImageSource";

export class HentsuDummySource implements Source<null> {
    name: string;
    baseUrl: URL;
    initialPageId: null;

    // `URL` constructor cannot produce relative URLs, so we have to get around
    // this by passing an absolute URL from the UI code explicitly.
    //
    // See https://github.com/whatwg/url/issues/531
    constructor(absoluteUrl: string) {
        this.name = "Hentsu dummy";
        this.baseUrl = new URL("/starboard.json", absoluteUrl);
    }

    pageUrl(): URL {
        const url = new URL(this.baseUrl);
        return url;
    }

    nextPageId(): null {
        return null;
    }

    parsePage(page: unknown): StarredImage[] {
        return (page as StarredImage[]).map((item) => ({
            isNsfw: true,
            ...item,
        }));
    }
}
