import { UnleashContext } from "../types/context";
import { createGradualRollout, normalizedHash } from "./gradualRollout";

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
    },
    flexibleRollout(params: {
        rollout: number,
        stickiness: string,
        groupId: string,
    }, ctx) {
        if (params.rollout == 100) return true
        if (params.rollout == 0) return false

        let value = {
            "default": ctx.userId ?? ctx.sessionId ?? null,
            "userId": ctx.userId,
            "sessionId": ctx.sessionId,
            "random": null,
        }[params.stickiness]

        if (value === undefined) {
            value = ctx.properties?.[params.stickiness]
        }

        if (value === undefined) {
            return false
        }

        const hash = value === null ? 1 + Math.floor(Math.random() * 100) : normalizedHash(params.groupId, value)

        return hash <= params.rollout
    }
} satisfies Record<string, StrategyFn<never>>

export type Strategies = typeof STRATEGIES
