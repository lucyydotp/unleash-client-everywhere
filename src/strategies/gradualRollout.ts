import { UnleashContext } from "../types/context";
import { murmur3 } from "../util/murmur";
import { StrategyFn } from "./strategy";

const encoder = new TextEncoder()

export function normalizedHash(group: string, input: string) {
    return (murmur3(
        encoder.encode(`${group}:${input}`)
    ) % 100) + 1
}

type GradualRolloutParams = {
    percentage: number
    groupId: string
}

export function createGradualRollout<const K extends keyof UnleashContext>(key: K): StrategyFn<GradualRolloutParams> {
    return (parameters, context) => {
        if (!context[key]) return false
        if (parameters.percentage == 100) return true
        return normalizedHash(parameters.groupId, context[key]) <= parameters.percentage
    }
}
