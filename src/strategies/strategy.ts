import { UnleashContext } from "../context";

export interface StrategyFn<T extends object> {
    (parameters: T, context: UnleashContext): void
}

export const STRATEGIES = {
    default: (params, ctx) => true,
    userWithId: (params: {userIds: string}, ctx) => {
        if (!ctx.userId) return false

        const userIds = params.userIds.split(/, ?/g)
        console.log(userIds)
        return userIds.includes(ctx.userId)
    }
} satisfies Record<string, StrategyFn<never>>

export type Strategies = typeof STRATEGIES
