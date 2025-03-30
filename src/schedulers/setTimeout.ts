import { Disposable } from "../util/disposable";
import { Scheduler } from "./scheduler";

/**
 * A scheduler that uses the DOM {@link setTimeout} and {@link setInterval} methods.
 * This scheduler works in browsers, in Node, and in Deno.
 */
export class DomScheduler extends Disposable implements Scheduler {
    private readonly subscriptions: number[] = []

    constructor() {
        super()
        if (!("setTimeout" in globalThis)) {
            throw new Error("Can't use DOM scheduler, setTimeout is not available")
        }
    }

    scheduleEvery(callback: () => void, interval: number): void {
        this.requireNotDisposed()
        this.subscriptions.push(setInterval(callback, interval))
    }

    onDispose(): void {
        for (const sub of this.subscriptions) {
            // clearTimeout applies to both timeouts and intervals
            // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-clearinterval
            clearTimeout(sub)
        }
    }
}
