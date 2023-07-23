import * as gen from "./gen-words"
import * as input from "./input"

export function testInit() {
    gen.getWordList()
    input.listenInput()
}
