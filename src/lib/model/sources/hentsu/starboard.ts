import type { Source, StarredImage } from "$lib/model/ImageSource";

export class HentsuStarboardSource implements Source<number> {
    name: string;
    baseUrl: URL;
    initialPageId: number;

    constructor(readonly startingTimestamp?: number) {
        this.name = "Hentsu starboard";
        this.baseUrl = new URL(
            "https://starboard-9xp4qxvm.ew.gateway.dev/v1/starred"
        );
        this.initialPageId = startingTimestamp ?? Date.now();
    }

    pageUrl(pageId?: number): [URL, number] {
        const url = new URL(this.baseUrl);
        url.searchParams.set("olderThan", pageId.toString());

        // FIXME: oops, can't return next pageId before downloading the page
        // :facepalm:
        return [url, pageId];
    }

    parsePage(page: unknown): StarredImage[] {
        return (page as StarredImage[]).map((item) => ({
            isNsfw: true,
            ...item,
        }));
    }
}
