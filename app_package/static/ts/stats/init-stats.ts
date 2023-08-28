import * as testStats from "./test-stats"

export function initStats(mode: string, language: string, length: number = 0) {
    const stats = testStats.generateTestStats(mode, language, length)
    return stats
}