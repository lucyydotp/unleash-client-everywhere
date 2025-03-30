import { FeaturesApiResponse } from "../types/feature";

/**
 * A REST client for the Unleash [server-side API](https://docs.getunleash.io/reference/api/unleash/client).
 */
export interface RestClient {
    getFeatures(): Promise<FeaturesApiResponse>
}
