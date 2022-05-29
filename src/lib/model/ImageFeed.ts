import { tick } from "svelte";
import {
    writable,
    Unsubscriber,
    Writable,
    Readable,
} from "svelte/store";
import { prefetchDimensions } from "../util/prefetchDimensions";
import { TaskQueue } from "../util/TaskQueue";
import { SourceStream, InternalImage } from "./ImageSource";

// FIXME: Temporary grouping, need to split according to responsibility.
export type AnnotatedImage = {
    img: HTMLImageElement;
    starred: InternalImage;
    idx: number;
    loadedIdx: number;
};

export class ImageFeed {
    private _exhausted: Writable<boolean> = writable(false);
    readonly exhausted: Readable<boolean> = { subscribe: this._exhausted.subscribe };

    private isFetching: boolean = false;

    private starboardData: InternalImage[] = [];

    private loadedImageIdxs: Set<number> = new Set();
    private loadedImages: Writable<AnnotatedImage[]> = writable([]);

    // From empirical testing, 2 concurrent tasks seems to strike a good balance
    // between loading fast and loading in order, prioritising above-the-fold.
    // This might be dependent on resolving tasks early by prefetching dimensions.
    // Currently set to 1 because ImageModal indexing relies on loadedImages
    // being in order.
    //
    // TODO: Increasing the number of concurrent downloads can potentially save around
    // 3 seconds of overhead per fetch, but we would need the infrastructure to
    // preserve resulting image order.
    private queue = new TaskQueue<{
        img: HTMLImageElement;
        starred: InternalImage;
        idx: number;
    }>(1);

    subscribe = this.loadedImages.subscribe;

    constructor(private readonly source: SourceStream<unknown, unknown>) {}

    async requestFetch(): Promise<void> {
        // Ensure there's only one fetch running at any given moment.
        if (this.isFetching) {
            return;
        }
        this.isFetching = true;

        await this.fetchNext();

        this.isFetching = false;
    }

    private async fetchNext(): Promise<void> {
        const moreImagesFiltered = await this.source.fetchNextPage();

        if (moreImagesFiltered.length === 0) {
            this._exhausted.set(true);
            return;
        }

        this.starboardData = [...this.starboardData, ...moreImagesFiltered];

        const indexedImages = this.starboardData.map((starred, idx) => ({
            starred,
            idx,
        }));

        for (const { starred, idx } of indexedImages) {
            if (this.loadedImageIdxs.has(idx)) {
                continue;
            }

            this.loadedImageIdxs.add(idx);
            this.queue
                .enqueue(
                    () =>
                        new Promise((resolve, reject) => {
                            const img = new Image();

                            prefetchDimensions(img).then(
                                ({ width, height }) => {
                                    if (width === 130 && height === 60) {
                                        reject("deleted reddit");
                                    } else if (width === 161 && height === 81) {
                                        reject("deleted imgur");
                                    } else {
                                        resolve({ img, starred, idx });
                                    }
                                }
                            );

                            img.addEventListener("error", reject);
                            img.src = starred.imageUrl;
                        })
                )
                .then(({ img, starred, idx }) => {
                    this.loadedImages.update((arr) => {
                        arr.push({ img, starred, idx, loadedIdx: arr.length });
                        return arr;
                    });
                })
                .catch((reason) =>
                    console.log(`Download failed ${starred.name}: ${reason}`)
                );
        }

        await this.queue.flushed();
        await tick();
    }

    // silence, machine
    // this can't be converted to an async function
    at(index: number): Promise<AnnotatedImage> {
        let unsubscribe: Unsubscriber;

        return new Promise<AnnotatedImage>((resolve) => {
            unsubscribe = this.loadedImages.subscribe((images) => {
                if (index < images.length) {
                    resolve(images[index]);
                } else {
                    this.requestFetch();
                }
            });
        }).then((e: AnnotatedImage) => {
            unsubscribe();
            return e;
        });
    }

    clear(): void {
        this.queue.clear();
    }
}
