
export function compareHashes(hash1: string, hash2: string): number {
    // Hamming distance
    let distance = 0
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) distance++
    }
    return distance
}

export function isMatch(hash1: string, hash2: string, threshold = 5): boolean {
    return compareHashes(hash1, hash2) <= threshold
}
