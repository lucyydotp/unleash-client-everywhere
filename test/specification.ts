import { expect } from "chai";
import specs from "../client-specification/specifications/index.json"
import { UnleashClient } from "../src";

const specFiles = await Promise.all(
    specs.map(s => import(`../client-specification/specifications/${s}`).then(e => e.default))
)

describe("Specification tests", async () => {
    for (const spec of specFiles) {
        if (!spec.tests) continue

        const client = await UnleashClient.create({
            getFeatures: () => Promise.resolve(spec.state)
        })

        describe(spec.name, function () {
            for (const test of spec.tests) {
                it(test.description, () => {
                    expect(client.isEnabled(test.toggleName, test.context)).to.equal(test.expectedResult)
                })
            }
        })
    }
})
