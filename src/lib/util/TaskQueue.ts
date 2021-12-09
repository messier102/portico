type DeferredPromise<T> = () => Promise<T>;

type Task<T> = {
    run: DeferredPromise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
    generation: number;
};

export class TaskQueue<T> {
    private queue: Task<T>[] = [];
    private openSlots: number;
    private generation: number = 0;
    private lastPromise: Promise<T> | null = null;

    constructor(maxConcurrentTasks: number) {
        this.openSlots = maxConcurrentTasks;
    }

    enqueue(run: DeferredPromise<T>): Promise<T> {
        this.lastPromise = new Promise((resolve, reject) => {
            this.queue.push({
                run,
                resolve,
                reject,
                generation: this.generation,
            });
            this.dequeue();
        });

        return this.lastPromise;
    }

    dequeue(): void {
        if (this.openSlots === 0) {
            return;
        }

        this.openSlots--;

        const task = this.queue.shift();

        if (!task) {
            this.openSlots++;
            return;
        }

        // FIXME: why are we running the task before checking its generation?
        // Should be the other way around (or rather, check on both ends).
        task.run()
            .then((value) =>
                task.generation === this.generation
                    ? task.resolve(value)
                    : task.reject("expired")
            )
            .catch((reason) => task.reject(reason))
            .finally(() => {
                this.openSlots++;
                this.dequeue();
            });
    }

    async flushed(): Promise<void> {
        await this.lastPromise;
    }

    clear(): void {
        this.queue = [];
        this.generation = (this.generation + 1) % Number.MAX_SAFE_INTEGER;
    }
}
