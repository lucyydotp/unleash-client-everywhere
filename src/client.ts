import { UnleashContext } from "./context";
import { STRATEGIES } from "./strategies/strategy";
import { Feature, FeaturesApiResponse } from "./types/feature";

export class UnleashClient {

    private features: Record<string, Feature> = {}

    public isEnabled(flagName: string, context: UnleashContext = {}, defaultValue: boolean = false): boolean {
        const flag = this.features[flagName]
        if (flag == undefined) return defaultValue

        if (flag.strategies.length == 0) return true

        for (const strategyDef of flag.strategies) {
            const strategy = STRATEGIES[strategyDef.name]
            if (strategy == undefined) throw new Error(`Unknown strategy ${strategyDef.name}`)

            if (strategy(strategyDef.parameters, context)) return true
        }

        return false
    }

    public setFeatures(features: FeaturesApiResponse) {
        this.features = {}
        if (!("features" in features)) return
        for (const feature of features.features) {
            if (!feature.enabled) continue
            this.features[feature.name] = feature
        }
    }
}
