import { BUILTIN_CONTEXT_FIELDS, UnleashContext } from "../types/context";
import { Constraint } from "../types/feature";

abstract class ConstraintImpl<T, M extends {} = string> {

    private static getField(context: UnleashContext, key: string) {
        if ((BUILTIN_CONTEXT_FIELDS as readonly string[]).includes(key)) {
            return context[key as keyof UnleashContext]
        }
        return context.properties?.[key]
    }

    protected abstract check(provided: M, expected: T, constraint: Constraint): boolean

    protected abstract map(value: string): M | undefined

    protected readonly valueOnUndefined: boolean = false

    satisfies(constraint: Constraint, context: UnleashContext): boolean {
        return this._satisfies(constraint, context) == !constraint.inverted
    }

    _satisfies(constraint: Constraint, context: UnleashContext): boolean {
        const contextValue = ConstraintImpl.getField(context, constraint.contextName)

        if (contextValue == undefined) {
            return this.valueOnUndefined
        }

        const mapped = this.map(contextValue)
        if (mapped == undefined) {
            return false
        }

        return this.check(mapped, ("values" in constraint ? constraint.values : constraint.value) as T, constraint)
    }
}

abstract class NumericConstraint extends ConstraintImpl<number, number> {
    override map(v: string) {
        const parsed = parseFloat(v)
        return isNaN(parsed) ? undefined : parsed
    }
}

function num(check: (value: number, expected: number) => boolean) {
    return new class extends NumericConstraint {
        override check = check
    }
}

abstract class StringConstraint extends ConstraintImpl<string[]> {
    override map = (t: string) => t

    protected abstract checkString(provided: string, expected: string): boolean

    override check(provided: string, expected: string[], constraint: Constraint): boolean {
        if (constraint.caseInsensitive == true) {
            provided = provided.toLowerCase()
        }
        for (let e of expected) {
            if (constraint.caseInsensitive == true) {
                e = e.toLowerCase()
            }
            if (this.checkString(provided, e)) {
                return true
            }
        }
        return false
    }
}

function str(check: (value: string, expected: string) => boolean) {
    return new class extends StringConstraint {
        override checkString = check
    }
}

export const CONSTRAINTS: Record<string, ConstraintImpl<never, {}>> = Object.freeze({
    IN: new class extends ConstraintImpl<string[]> {
        override map = (t: string) => t
        override check = (v: string, e: string[]) => e.includes(v)
    },
    NOT_IN: new class extends ConstraintImpl<string[]> {
        override map = (t: string) => t
        override check = (v: string, e: string[]) => !e.includes(v)
        override valueOnUndefined = true
    },

    NUM_EQ: num((v, e) => v == e),
    NUM_GT: num((v, e) => v > e),
    NUM_GTE: num((v, e) => v >= e),
    NUM_LT: num((v, e) => v < e),
    NUM_LTE: num((v, e) => v <= e),

    DATE_AFTER: new class extends ConstraintImpl<string, number> {
        override map = (t: string) => Date.parse(t)

        override check(p: number, e: string) {
            return p > Date.parse(e)
        }
    },
    DATE_BEFORE: new class extends ConstraintImpl<string, number> {
        override map = (t: string) => Date.parse(t)

        override check(p: number, e: string) {
            return p < Date.parse(e)
        }
    },

    STR_CONTAINS: str((p, e) => p.includes(e)),
    STR_ENDS_WITH: str((p, e) => p.endsWith(e)),
    STR_STARTS_WITH: str((p, e) => p.startsWith(e)),
})
