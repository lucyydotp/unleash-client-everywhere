import { UnleashContext } from "../types/context";
import { createGradualRollout } from "./gradualRollout";

export interface StrategyFn<T extends object> {
    (parameters: T, context: UnleashContext): boolean
}

export const STRATEGIES = {
    default: (params, ctx) => true,
    userWithId: (params: {userIds: string}, ctx) => {
        if (!ctx.userId) return false

        const userIds = params.userIds.split(/, ?/g)
        return userIds.includes(ctx.userId)
    },
    gradualRolloutUserId: createGradualRollout("userId"),
    gradualRolloutSessionId: createGradualRollout("sessionId"),
    gradualRolloutRandom(params: {percentage: number}, ctx) {
        return Math.random() * 100 < params.percentage
    }
} satisfies Record<string, StrategyFn<never>>

export type Strategies = typeof STRATEGIES
