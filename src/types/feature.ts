import { Strategies, StrategyFn } from "../strategies/strategy";

export interface Strategy<T extends keyof Strategies = keyof Strategies> {
    name: T
    parameters: Strategies[T] extends StrategyFn<infer P> ? P : never
}

export interface Feature {
    name: string,
    description: string,
    enabled: boolean,
    strategies: Strategy[]
}

export interface FeaturesApiResponse {
    version: number,
    features: Feature[]
}
