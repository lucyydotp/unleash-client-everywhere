const c1 = 0xcc9e2d51
const c2 = 0x1b873593

function rotl32(i: number, n: number): number {
    return ((i << n) | (i >>> (32 - n))) >>> 0
}

/** Finalization mix - force all bits of a hash block to avalanche */
function fmix32(h: number): number {
    h ^= h >>> 16
    h = Math.imul(h, 0x85ebca6b)
    h ^= h >>> 13
    h = Math.imul(h, 0xc2b2ae35)
    h ^= h >>> 16
    return h >>> 0
}

/**
 * Hashes a byte array using the 32-bit x86 variant of the MurmurHash3 algorithm.
 * @param data the data to hash
 * @param seed the seed to hash with
 */
export function murmur3(data: Uint8Array, seed: number = 0): number {
    const nblocks = Math.floor(data.length / 4)
    let h1 = seed

    // Body
    for (let i = 0; i < nblocks; i++) {
        let k1 =
            (data[i * 4] & 0xff) |
            ((data[i * 4 + 1] & 0xff) << 8) |
            ((data[i * 4 + 2] & 0xff) << 16) |
            ((data[i * 4 + 3] & 0xff) << 24)

        k1 = Math.imul(k1, c1)
        k1 = rotl32(k1, 15)
        k1 = Math.imul(k1, c2)

        h1 ^= k1
        h1 = rotl32(h1, 13)
        h1 = Math.imul(h1, 5) + 0xe6546b64
    }

    // Tail
    const tail = data.subarray(nblocks * 4)
    let k1 = 0

    switch (data.length & 3) {
        case 3:
            k1 ^= tail[2] << 16
        // fallthrough
        case 2:
            k1 ^= tail[1] << 8
        // fallthrough
        case 1:
            k1 ^= tail[0]
            break
    }

    // Finalization
    k1 = Math.imul(k1, c1)
    k1 = rotl32(k1, 15)
    k1 = Math.imul(k1, c2)
    h1 ^= k1

    h1 ^= data.length
    h1 = fmix32(h1)

    return h1 >>> 0
}
