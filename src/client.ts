import { RestClient } from "./restClient/restClient";
import { Scheduler } from "./schedulers/scheduler";
import { CONSTRAINTS } from "./strategies/constraint";
import { STRATEGIES } from "./strategies/strategy";
import { UnleashContext } from "./types/context";
import { Feature, FeaturesApiResponse } from "./types/feature";
import { Disposable } from "./util/disposable";

/**
 * An Unleash client.
 */
export class UnleashClient extends Disposable {

    private features: Record<string, Feature> = {}

    private constructor(
        private readonly restClient: RestClient,
        private readonly scheduler?: Scheduler,
        private readonly pollingInterval: number = 15000,
    ) {
        super()
        this.scheduler?.scheduleEvery(this.refresh.bind(this), this.pollingInterval)
    }

    public isEnabled(flagName: string, context: UnleashContext = {}, defaultValue: boolean = false): boolean {
        this.requireNotDisposed()
        const flag = this.features[flagName]
        if (flag == undefined) return defaultValue

        if (flag.strategies.length == 0) return true

        for (const strategyDef of flag.strategies) {
            const strategy = STRATEGIES[strategyDef.name]
            if (strategy == undefined) throw new Error(`Unknown strategy ${strategyDef.name}`)

            const satisfiesConstraints = !strategyDef.constraints || strategyDef.constraints.every(
                c => CONSTRAINTS[c.operator]?.satisfies(c, context) ?? false
            )

            if (satisfiesConstraints && strategy.fn(strategyDef.parameters as any, context)) return true
        }

        return false
    }

    private setFeatures(features: FeaturesApiResponse) {
        this.requireNotDisposed()
        this.features = {}
        if (!("features" in features)) return
        for (const feature of features.features) {
            if (!feature.enabled) continue
            this.features[feature.name] = feature
        }
    }

    /**
     * Refreshes the client's features from the API server.
     */
    public async refresh() {
        this.setFeatures(await this.restClient.getFeatures())
    }

    protected onDispose() {
        this.scheduler?.dispose()
    }

    /**
     * Creates a new client.
     * @param restClient the REST client to use to access the Unleash server
     * @param scheduler the scheduler to use to schedule refreshes
     * @param pollingInterval how often to refresh the client
     */
    public static async create(
        restClient: RestClient,
        scheduler?: Scheduler,
        pollingInterval: number = 15000
    ): Promise<UnleashClient> {
        const client = new UnleashClient(restClient, scheduler, pollingInterval)
        await client.refresh()
        return client
    }
}
