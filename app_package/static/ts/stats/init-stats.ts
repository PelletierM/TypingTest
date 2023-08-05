import * as timer from "./timer"
import * as testStats from "./test-stats"

export function initStats(type: string, time: number = 0) {
    const stats = testStats.generateTestStats(type, time)
    timer.generateTimer(time)

    return stats
}