import * as gen from "./gen-words"

import { generateCounter } from "../stats/counter"
import * as stats from "../stats/init-stats"
import { preferences } from "../settings/preferences"

export class Test {
    testStats = stats.initStats(preferences["mode"], preferences["language"], preferences["length"])
    
    initTest() {
        gen.getWordList(preferences["mode"], preferences["length"], preferences["language"])
        generateCounter()

    }

    resetTest() {
        this.testStats = stats.initStats(preferences["mode"], preferences["language"], preferences["length"])
        gen.updateWords(preferences["mode"], preferences["length"])
        generateCounter()
    }
}