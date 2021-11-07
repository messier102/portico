export type InternalImage = {
    name: string;
    imageUrl: string;
    isNsfw: boolean;
};

export type SourceResponse<TPageId> =
    | { status: "success"; images: InternalImage[]; nextPageId: TPageId | null }
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
    private nextPageId: TPageId | null = null;
    private exhausted: boolean = false;

    constructor(private readonly source: Source<TPageId, TResponse>) {}

    async fetchNextPage(): Promise<InternalImage[]> {
        if (this.exhausted) {
            return [];
        }

        const response = await SourceStream.fetchPage(
            this.source,
            this.nextPageId
        );

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

    private static async fetchPage<TPageId, TResponse>(
        source: Source<TPageId, TResponse>,
        pageId: TPageId
    ): Promise<SourceResponse<TPageId>> {
        const pageUrl = source.getPageUrl(pageId);

        const httpResponse = await fetch(pageUrl.toString());
        const sourceResponse = await httpResponse.json();

        const parsedResponse = source.parseResponse(sourceResponse, pageId);

        return parsedResponse;
    }
}
