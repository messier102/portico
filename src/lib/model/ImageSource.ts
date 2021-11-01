export type Image = {
    name: string;
    imageUrl: string;
    isNsfw: boolean;
};

export type SourceResponse<PageId> =
    | { status: "success"; images: Image[]; nextPageId: PageId | null }
    | { status: "exhausted" }
    | { status: "invalid" };

export interface Source<TPageId, TResponse> {
    name: string;
    baseUrl: URL;

    // pass null for initial page, is there a more explicit way?
    getPageUrl(pageId: TPageId | null): URL;

    parseResponse(
        response: TResponse,
        pageId: TPageId | null // get next pageId for sequentially indexed pages (pageId + 1)
    ): SourceResponse<TPageId>;
}

export class SourceStream<TPageId, TResponse> {
    private nextPageId: TPageId = null;
    private exhausted: boolean = false;

    constructor(private readonly source: Source<TPageId, TResponse>) {}

    async fetchNextPage(): Promise<Image[]> {
        if (this.exhausted) {
            return [];
        }

        const response = await this.fetchPage();

        if (response.status !== "success") {
            this.exhausted = true;
            return [];
        }

        if (response.nextPageId) {
            this.nextPageId = response.nextPageId;
        } else {
            this.exhausted = true;
        }

        return response.images;
    }

    async fetchPage(): Promise<SourceResponse<TPageId>> {
        const pageId = this.nextPageId;
        const pageUrl = this.source.getPageUrl(pageId);

        const httpResponse = await fetch(pageUrl.toString());
        const sourceResponse = await httpResponse.json();

        const parsedResponse = this.source.parseResponse(
            sourceResponse,
            pageId
        );

        return parsedResponse;
    }
}
