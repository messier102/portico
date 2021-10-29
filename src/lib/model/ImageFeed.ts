import { tick } from "svelte";
import type { Unsubscriber, Writable } from "svelte/store";
import { writable } from "svelte/store";
import { prefetchDimensions } from "../util/prefetchDimensions";
import { sleepMs } from "../util/sleepMs";
import { TaskQueue } from "../util/TaskQueue";
import type { SourceExtractor, StarredImage } from "./ImageSource";

// FIXME: Temporary grouping, need to split according to responsibility.
export type AnnotatedImage = {
    img: HTMLImageElement;
    starred: StarredImage;
    idx: number;
    loadedIdx: number;
};

export class ImageFeed {
    private isFetching: boolean = false;
    private lastFetchedAt: number = 0;

    private starboardData: StarredImage[] = [];

    private loadedImageIdxs: Set<number> = new Set();
    private loadedImages: Writable<AnnotatedImage[]> = writable([]);

    // From empirical testing, 2 concurrent tasks seems to strike a good balance
    // between loading fast and loading in order, prioritising above-the-fold.
    // This might be dependent on resolving tasks early by prefetching dimensions.
    // Currently set to 1 because ImageModal indexing relies on loadedImages being in order.
    private queue = new TaskQueue(1);

    subscribe = this.loadedImages.subscribe;

    constructor(private readonly source: SourceExtractor<unknown, unknown>) {}

    async fetchNext(): Promise<boolean> {
        // TODO: prevent fetching until all images have loaded
        // as opposed to a dumb timeout
        if (this.isFetching) {
            return false;
        }

        this.isFetching = true;

        const waitTime = this.lastFetchedAt + 5000 - Date.now();

        if (waitTime > 0) {
            await sleepMs(waitTime);
        }
        this.lastFetchedAt = Date.now();

        const moreImagesFiltered = await this.source.fetchNextPage();
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

        await tick();

        this.isFetching = false;
        return true;
    }

    at(index: number): Promise<AnnotatedImage> {
        let unsubscribe: Unsubscriber;

        return new Promise((resolve) => {
            unsubscribe = this.loadedImages.subscribe((images) => {
                if (index < images.length) {
                    resolve(images[index]);
                } else {
                    this.fetchNext();
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
