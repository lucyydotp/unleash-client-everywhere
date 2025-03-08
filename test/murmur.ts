import { expect } from "chai";
import { murmur3 } from "../src/util/murmur.js";

const encoder = new TextEncoder()

const SEEDS = [0, 150, 25565]

const EXPECTED_STRINGS = {
    "According to all known laws of aviation, there is no way a bee should be able to fly.": [
        2464257399,
        323334028,
        1109812535
    ],
    "short": [
        883390095, 819233936, 2883931807
    ]
}

describe("Murmur3 hash", () => {
    for (const str of Object.keys(EXPECTED_STRINGS)) {
        it(`Hashes correctly - "${str}"`, () => {
            const encoded = encoder.encode(str)
            for (let i = 0; i < SEEDS.length; i++) {
                expect(murmur3(encoded, SEEDS[i]), `Invalid hash (input "${str}", seed ${SEEDS[i]})`).to.equal(
                    EXPECTED_STRINGS[str as keyof typeof EXPECTED_STRINGS][i])
            }
        })
    }
})
