export type StarredImage = {
    name: string;
    imageUrl: string;
    directUrl: string;
    starredBy: string;
    starredAt: number;
    isNsfw: boolean;
};

export interface ImageSource {
    fetchNextPage(): Promise<StarredImage[]>;
    reset(): void;
}

export interface Source<PageId> {
    readonly name: string;
    readonly baseUrl: URL;
    readonly initialPageId: PageId;

    pageUrl(pageId?: PageId): [URL, PageId];
    parsePage(page: unknown): StarredImage[];
}

export class SourceExtractor<PageId> {
    private nextPageId: PageId;

    constructor(readonly source: Source<PageId>) {
        this.nextPageId = source.initialPageId;
    }

    async fetchNextPage(): Promise<StarredImage[]> {
        const [pageUrl, nextPageId] = this.source.pageUrl(this.nextPageId);

        const response = await fetch(pageUrl.toString());
        const page = await response.json();

        const images = this.source.parsePage(page);

        this.nextPageId = nextPageId;

        return images;
    }
}
