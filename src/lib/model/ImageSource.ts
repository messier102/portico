export type StarredImage = {
    name: string;
    imageUrl: string;
    directUrl: string;
    starredBy: string;
    starredAt: number;
    isNsfw: boolean;
};

export interface Source<PageId, Page> {
    readonly name: string;
    readonly baseUrl: URL;
    readonly initialPageId: PageId;

    pageUrl(pageId?: PageId): URL;
    isExhausted(page: Page): boolean;
    hasNextPage(page: Page): boolean;
    nextPageId(pageId: PageId, page: Page): PageId;
    parsePage(page: Page): StarredImage[];
}

export class SourceExtractor<PageId, Page> {
    private nextPageId: PageId;
    private exhausted: boolean;

    constructor(readonly source: Source<PageId, Page>) {
        this.nextPageId = source.initialPageId;
        this.exhausted = false;
    }

    async fetchNextPage(): Promise<StarredImage[]> {
        if (this.exhausted) {
            return [];
        }

        const pageUrl = this.source.pageUrl(this.nextPageId);

        const response = await fetch(pageUrl.toString());
        const page = await response.json();

        if (this.source.isExhausted(page)) {
            this.exhausted = true;
            return [];
        }

        const images = this.source.parsePage(page);

        if (!this.source.hasNextPage(page)) {
            this.exhausted = true;
        } else {
            this.nextPageId = this.source.nextPageId(this.nextPageId, page);
        }

        return images;
    }
}
