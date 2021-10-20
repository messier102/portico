export async function onlyFulfilled<T>(promises: Promise<T>[]): Promise<T[]> {
    const results = await Promise.allSettled(promises);

    return results
        .filter((r) => r.status === "fulfilled")
        .map((r: PromiseFulfilledResult<T>) => r.value);
}
