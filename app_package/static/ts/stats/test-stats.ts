import * as types from "../test/test.types"

export class TestStats implements types.testStats {
    type: string
    time: number
    wpm: number
    rawWpm: number
    accuracy: number
    state: "inactive" | "active" | "completed" | "aborted"
    inputStats: types.inputStats

    constructor(type: string, time: number = 0, stats: types.inputStats = new InputStats) {
        this.type = type
        this.time = time
        this.wpm = 0
        this.rawWpm = 0
        this.accuracy = 0
        this.state = "inactive"
        this.inputStats = stats
    }

    updateAccuracy(inputStats: types.inputStats = this.inputStats) {
        this.accuracy = updateAccuracy(inputStats.correctInput, inputStats.incorrectInput)
    }

    updateWpm(inputStats: types.inputStats = this.inputStats) {
        this.wpm = updateWpm(inputStats.wpmStats.correctWordsChars, (inputStats.endTime - inputStats.startTime))
        this.rawWpm = updateWpm((inputStats.wpmStats.correctWordsChars + inputStats.wpmStats.correctChars + inputStats.wpmStats.incorrectChars + inputStats.wpmStats.extraChars), (inputStats.endTime - inputStats.startTime))
    }
}

export class InputStats implements types.inputStats {
    correctInput: number
    incorrectInput: number
    wpmStats: types.wpmStats
    startTime: number
    endTime: number
    timerID: ReturnType<typeof setInterval> | undefined

    constructor(startTime: number = Date.now()) {
        this.correctInput = 0
        this.incorrectInput = 0
        this.wpmStats = {
            correctWordsChars: 0,
            correctChars: 0,
            incorrectChars: 0,
            extraChars: 0
        }
        this.startTime = startTime
        this.endTime = startTime + 1
        this.timerID = undefined
    }

    updateInputCounts(inputValidity: string) {
        switch(inputValidity) {
            case "correct":
                this.correctInput++
                break;
            case "incorrect":
                this.incorrectInput++
                break;
        }
    }

    updateStats(activeChar: HTMLElement) {
        const result = updateChars(activeChar)
        this.wpmStats = result
        this.endTime = Date.now()
    }
}

function updateWpm(count: number, time: number) {
    return (count / (time / 1000) / 5 * 60)
}

function updateAccuracy(correctCount: number, invalidCount: number) {
    return (correctCount / (correctCount + invalidCount))
}

function updateChars(activeChar: HTMLElement): types.wpmStats {
    const currentCharStats = {
        correctWordsChars: 0,
        correctChars: 0,
        incorrectChars: 0,
        extraChars: 0
    };

    (function getChar(char: HTMLElement) {
        const correctWord = checkCorrectWord(char)
        const charState: string | undefined = checkCharState(char, correctWord)

        if (charState) {
            currentCharStats[`${charState}Chars` as keyof types.wpmStats]++
        }

        const previousChar = getPreviousChar(char)
        if (!previousChar) return

        const correctSpace = checkCorrectSpace(previousChar)
        if (correctSpace) {
            currentCharStats[`${correctSpace}Chars` as keyof types.wpmStats]++
        }

        getChar(previousChar)
    })(activeChar)

    return currentCharStats
}

function checkCharState(char: HTMLElement, correctWord: boolean): string | undefined {
    if (char.matches(".extra")) {
        return "extra"
    }
    if (char.matches(".incorrect")) {
        return "incorrect"
    }
    if (char.matches(".correct")) {
        if (correctWord) return "correctWords"
        return "correct"
    }
    return undefined
}

function checkCorrectWord(char: HTMLElement): boolean {
    return !(char.parentElement as HTMLElement).matches(".incorrectWord")
}

function getPreviousChar(char: HTMLElement): HTMLElement | undefined {  
    if (char.previousElementSibling) {
        return char.previousElementSibling as HTMLElement
    } 
    if ((char.parentElement as HTMLElement).previousElementSibling) {
        return Array.from(((char.parentElement as HTMLElement).previousElementSibling as HTMLElement).querySelectorAll('.correct, .incorrect')).pop() as HTMLElement
    } 
    return undefined
}

function checkCorrectSpace(previousChar: HTMLElement): string | undefined {
    const previousWordLastChar: HTMLElement = Array.from((previousChar.parentElement as HTMLElement).querySelectorAll('.letter')).pop() as HTMLElement
    const previousCorrectWord = checkCorrectWord(previousChar)
        
    if (previousChar === previousWordLastChar) {
        if (previousCorrectWord) return "correctWords"
        else  return "correct"
    }
    return undefined
}

export function generateTestStats(type: string, time: number): types.testStats {
    return new TestStats(type, time)
}