import { Runtype } from "runtypes";
import * as r from "runtypes";
import { UnleashContext } from "../types/context";
import { createGradualRollout, normalizedHash } from "./gradualRollout";

export interface StrategyDefinition<T = unknown> {
    params: Runtype.Core<T>,

    fn(parameters: T, context: UnleashContext): boolean
}

export function strategy<const P>(
    params: Runtype.Core<P>,
    fn: (params: P, context: UnleashContext) => boolean
): StrategyDefinition<P> {
    return {params, fn}
}

export const STRATEGIES: Record<string, StrategyDefinition> = {
    default: strategy(r.Unknown, () => true),
    userWithId: strategy(
        r.Object({
            userIds: r.String
        }),
        (params, ctx) => {
            if (!ctx.userId) return false

            const userIds = params.userIds.split(/, ?/g)
            return userIds.includes(ctx.userId)
        },
    ),
    gradualRolloutUserId: createGradualRollout("userId"),
    gradualRolloutSessionId: createGradualRollout("sessionId"),
    gradualRolloutRandom: strategy(
        r.Object({
            percentage: r.String
        }),
        (params) => Math.random() * 100 < parseInt(params.percentage)
    ),

    flexibleRollout: strategy(
        r.Object({
            rollout: r.Number,
            stickiness: r.String,
            groupId: r.String,
        }),
        (params, ctx) => {
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
    ),
}
