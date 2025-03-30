/**
 * Something that can be disposed.
 */
export interface IDisposable {
    /**
     * Whether this object has been disposed.
     */
    readonly isDisposed: boolean

    /**
     * Disposes the object. If it's already been disposed, does nothing.
     */
    dispose(): void
}

export abstract class Disposable implements IDisposable {
    #isDisposed: boolean = false

    public get isDisposed() {
        return this.#isDisposed
    }

    /**
     * Called when the class is disposed of.
     */
    protected abstract onDispose(): void

    /**
     * Throws an error if the class has been disposed of.
     */
    protected requireNotDisposed() {
        if (this.#isDisposed) {
            throw new Error(`${this.constructor.name} has been disposed of`)
        }
    }

    /**
     * Disposes the class. Do not override.
     */
    dispose(): void {
        this.onDispose()
        this.#isDisposed = true
    }
}
