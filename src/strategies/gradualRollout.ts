import * as r from "runtypes"
import { UnleashContext } from "../types/context";
import { murmur3 } from "../util/murmur";
import { strategy, StrategyDefinition } from "./strategy";

const encoder = new TextEncoder()

export function normalizedHash(group: string, input: string) {
    return (murmur3(
        encoder.encode(`${group}:${input}`)
    ) % 100) + 1
}

export function createGradualRollout<const K extends keyof UnleashContext>(key: K): StrategyDefinition {
    return strategy(
        r.Object({
            percentage: r.Number,
            groupId: r.String,
        }),
        (parameters, context) => {
            if (!context[key]) return false
            if (parameters.percentage == 100) return true
            return normalizedHash(parameters.groupId, context[key]) <= parameters.percentage
        })
}
