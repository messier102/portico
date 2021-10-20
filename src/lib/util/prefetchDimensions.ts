type Dimensions = { width: number; height: number };

export function prefetchDimensions(
    image: HTMLImageElement,
    pollingRateMs: number = 10
): Promise<Dimensions> {
    return new Promise((resolve) => {
        const poll = setInterval(() => {
            if (image.naturalWidth && image.naturalHeight) {
                clearInterval(poll);
                resolve({
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                });
            }
        }, pollingRateMs);

        // TODO: check for leaks (e.g. image.onerror)
    });
}
