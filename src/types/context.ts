export const BUILTIN_CONTEXT_FIELDS = [
    "appName",
    "environment",
    "userId",
    "sessionId",
    "remoteAddress",
    "properties",
    "currentTime",
] as const

export type UnleashContext = { [K in (typeof BUILTIN_CONTEXT_FIELDS)[number]]?: string } & {
    properties?: Record<string, string>
}
