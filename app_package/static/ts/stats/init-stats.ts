import * as timer from "./timer"
import * as testStats from "./test-stats"

export function initStats(mode: string, language: string, time: number = 0) {
    const stats = testStats.generateTestStats(mode, language, time)
    timer.generateTimer(time)

    return stats
}