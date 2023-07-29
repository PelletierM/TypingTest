interface inputStats {
    correctInput: number
    incorrectInput: number
    correctWordsChars: number
    correctChars: number
    incorrectChars: number
    extraChars: number
    startTime: number
    endTime: number
}

interface charStats {
    correctWordsChars: number
    correctChars: number
    incorrectChars: number
    extraChars: number
}

export class Test {
    type: string
    wpm: number
    rawWpm: number
    accuracy: number
    // State (inactive, active, complete) here too?

    constructor(type: string) {
        this.type = type
        this.wpm = 0
        this.rawWpm = 0
        this.accuracy = 0
    }

    update(object: inputStats) {
        this.wpm = updateWpm(object.correctWordsChars, (object.endTime - object.startTime))
        this.rawWpm = updateWpm((object.correctWordsChars + object.correctChars + object.incorrectChars + object.extraChars), (object.endTime - object.startTime))
        this.accuracy = updateAccuracy(object.correctInput, object.incorrectInput)
    }
}

export class InputStats {
    correctInput: number
    incorrectInput: number
    correctWordsChars: number
    correctChars: number
    incorrectChars: number
    extraChars: number
    startTime: number
    endTime: number

    constructor(startTime: number = Date.now()) {
        this.correctInput = 0
        this.incorrectInput = 0
        this.correctWordsChars = 0
        this.correctChars = 0
        this.incorrectChars = 0
        this.extraChars = 0
        this.startTime = startTime
        this.endTime = startTime + 1 // +1 to avoid possible division by 0 on stats
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
        this.correctWordsChars = result.correctWordsChars
        this.correctChars = result.correctChars
        this.incorrectChars = result.incorrectChars
        this.extraChars = result.extraChars
        this.endTime = Date.now()
    }
}

function updateWpm(count: number, time: number) {
    return (count / (time / 1000) / 5 * 60)
}

function updateAccuracy(correctCount: number, invalidCount: number) {
    return (correctCount / (correctCount + invalidCount))
}

function updateChars(activeChar: HTMLElement): charStats {
    const currentCharStats = {
        correctWordsChars: 0,
        correctChars: 0,
        incorrectChars: 0,
        extraChars: 0
    };

    (function getChar(char: HTMLElement) {
        const correctWord = checkCorrectWord(char)
        let charState: string = checkCharState(char)
        if (charState === "correct" && correctWord) {
            charState = "correctWords"
        }

        if (charState !== "inactive") {
            currentCharStats[`${charState}Chars` as keyof charStats]++
        }

        let previousChar: HTMLElement


        if (char.previousElementSibling) {
            previousChar = char.previousElementSibling as HTMLElement
        } 
        else if ((char.parentElement as HTMLElement).previousElementSibling) {
            previousChar = Array.from(((char.parentElement as HTMLElement).previousElementSibling as HTMLElement).querySelectorAll('.correct, .incorrect')).pop() as HTMLElement
            const previousWordLastChar: HTMLElement = Array.from(((char.parentElement as HTMLElement).previousElementSibling as HTMLElement).querySelectorAll('.letter')).pop() as HTMLElement
            const previousCorrectWord = checkCorrectWord(previousChar)
            
            if (previousChar === previousWordLastChar) {
                if (previousCorrectWord) currentCharStats.correctWordsChars++
                else currentCharStats.correctChars++
            }
        } else return

        getChar(previousChar)
    })(activeChar)

    return currentCharStats
}

function checkCharState(char: HTMLElement): string {
    if (char.matches(".extra")) {
        return "extra"
    }
    if (char.matches(".incorrect")) {
        return "incorrect"
    }
    if (char.matches(".correct")) {
        return "correct"
    }
    return "inactive"
}

function checkCorrectWord(element: HTMLElement): boolean {
    return !(element.parentElement as HTMLElement).matches(".incorrectWord")
}