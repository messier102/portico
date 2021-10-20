export async function sleepMs(timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, Math.max(timeMs, 0)));
}
