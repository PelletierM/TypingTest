import * as types from "./test.types"
import * as gen from "./gen-words"
import * as input from "./input"

export function initTest(testStats: types.testStats) {
    gen.getWordList()
    input.listenInput(testStats)
}
