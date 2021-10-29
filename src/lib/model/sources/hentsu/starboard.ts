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

    isExhausted(page: unknown): boolean {
        return (page as unknown[]).length === 0;
    }

    hasNextPage(page: unknown): boolean {
        return true;
    }

    pageUrl(pageId?: number): URL {
        const url = new URL(this.baseUrl);
        url.searchParams.set("olderThan", pageId.toString());

        return url;
    }

    nextPageId(_pageId: number, page: unknown): number {
        const images = page as StarredImage[];
        
        if (images.length > 0) {
            return images[images.length - 1].starredAt;
        } else {
            // TODO: implement exhaustion checking;
            return null;
        }
    }

    parsePage(page: unknown): StarredImage[] {
        return (page as StarredImage[]).map((item) => ({
            isNsfw: true,
            ...item,
        }));
    }
}
