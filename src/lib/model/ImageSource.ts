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
