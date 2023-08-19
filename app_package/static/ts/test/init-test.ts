import * as gen from "./gen-words"
import * as input from "./input"
import * as stats from "../stats/init-stats"

const testMode = "time 15"
const language = "french"
const testLength = 15

export class Test {
    testStats = stats.initStats(testMode, language, testLength)

    initTest() {
        gen.getWordList(language)
    }

    resetTest() {
        input.abortTest(this.testStats)
        this.testStats = stats.initStats(testMode, language, testLength)
        gen.updateWords()
    }
}