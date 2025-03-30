import * as r from "runtypes"
import { STRATEGIES } from "../strategies/strategy";

export const Constraint =
    r.Intersect(
        r.Object({
            contextName: r.String,
            operator: r.String,
            caseInsensitive: r.Boolean.optional(),
            inverted: r.Boolean.optional(),
        }),
        r.Union(
            r.Object({
                value: r.Unknown
            }),
            r.Object({
                values: r.Array(r.Unknown)
            })
        )
    )

export type Constraint = r.Static<typeof Constraint>

const Strategy = r.Intersect(
    r.Object({
        constraints: r.Array(Constraint)
    }),
    r.Union(
        ...Object.entries(STRATEGIES).map(([name, {params}]) => r.Object({
            name: r.Literal(name),
            parameters: params
        }))
    )
)

const Feature = r.Object({
    name: r.String,
    description: r.String.optional(),
    enabled: r.Boolean,
    strategies: r.Array(Strategy)
})

export type Feature = r.Static<typeof Feature>

export const FeaturesApiResponse = r.Object({
    version: r.Number,
    features: r.Array(Feature)
})

export type FeaturesApiResponse = r.Static<typeof FeaturesApiResponse>
