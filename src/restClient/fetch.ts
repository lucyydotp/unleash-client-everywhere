import { FeaturesApiResponse } from "../types/feature";
import { RestClient } from "./restClient";

type FetchFn = typeof globalThis.fetch

/**
 * A REST client that uses the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 * Available on all modern browsers, Node since v18, and Deno.
 * Can also be used on other platforms by providing a fetch-compatible function in the constructor,
 * for example the one provided by node-fetch.
 */
export class FetchRestClient implements RestClient {

    /**
     * @param url the Unleash server's root URL
     * @param clientToken the client token to use to authenticate
     * @param fetch a function implementing the Fetch API. Defaults to `globalThis.fetch`.
     */
    constructor(
        private readonly url: string,
        private readonly clientToken: string,
        private readonly fetch: FetchFn = globalThis.fetch
    ) {
        if (this.fetch == undefined) {
            throw new Error(`FetchRestClient has no fetch function defined`)
        }
        if (!this.url.endsWith("/")) {
            this.url += "/"
        }
    }

    async getFeatures(): Promise<FeaturesApiResponse> {
        const res = await this.fetch(
            `${this.url}api/client/features`,
            {
                headers: {
                    accept: 'application/json',
                    authorization: this.clientToken,
                }
            }
        )

        return FeaturesApiResponse.check(await res.json());
    }
}
