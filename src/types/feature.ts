import { Strategies, StrategyFn } from "../strategies/strategy";

export type Constraint = {
    contextName: string,
    operator: string,
    caseInsensitive?: boolean,
    inverted?: boolean,
} & ({
    value: unknown
} | {
    values: unknown[]
})

export interface Strategy<T extends keyof Strategies = keyof Strategies> {
    name: T
    parameters: Strategies[T] extends StrategyFn<infer P> ? P : never,
    constraints?: Constraint[]
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
