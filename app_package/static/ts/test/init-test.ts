import * as gen from "./gen-words"
import * as input from "./input"
import * as stats from "../stats/init-stats"

const testMode = "time15"
const testLength = 15

export class Test {
    testStats = stats.initStats(testMode, testLength)

    initTest() {
        gen.getWordList()
    }

    resetTest() {
        input.abortTest(this.testStats)
        this.testStats = stats.initStats(testMode, testLength)
        gen.updateWords()
    }
}