import { Disposable } from "../util/disposable";

/**
 * Schedules callbacks to run later.
 */
export interface Scheduler extends Disposable {
    /**
     * Schedules a callback to run at approximately a set interval. The first excecution happens after the delay.
     * @param callback the callback to run
     * @param interval how often to run it, in milliseconds
     */
    scheduleEvery(callback: () => void, interval: number): void
}
