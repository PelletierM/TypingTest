import * as gen from "./gen-words"
import * as input from "./input"

export function initTest() {
    gen.getWordList()
    input.listenInput()
}
