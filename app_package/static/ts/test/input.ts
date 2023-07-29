import { updateCursor } from "./cursor"
import { startTimer } from "../stats/timer"
import * as testStats from "../stats/test-stats"

let activeChar: HTMLElement

export function listenInput() {
    const test = new testStats.Test("time60")
    const inputStats = new testStats.InputStats

    const inputField = document.querySelector("#test-input") as HTMLInputElement
    const testContainer = document.querySelector("#test")
    testContainer?.addEventListener("focusin", function(e){
        e.preventDefault
        inputField.focus()
    })
    inputField?.addEventListener("input", function(e) {
        const inputType = (e as InputEvent).inputType
        const data = (e as InputEvent).data
        const target = (e as InputEvent).target as HTMLInputElement
        if (!activeChar) {
            activeChar = ((document.querySelector("#words") as HTMLElement).firstChild as HTMLElement).firstChild as HTMLElement
            inputStats.startTime = Date.now()
            startTimer(60)
        }
        inputStats.updateInputCounts(updateActiveChar(data, inputType)); // This has to come before updateWordState
        updateWordState(activeChar) // This has to come before updateStats
        inputStats.updateStats(activeChar)
        test.update(inputStats)
        updateCursor(activeChar)
        updateHTMLStats(test)
        target.value = " ";
    })
}

function checkForbiddenInput(inputType: string): boolean {
    const allowedInputs = ["insertText", "deleteContentBackward"]
    if (!allowedInputs.includes(inputType)) return true
    return false
}

function checkWordStart(): boolean {
    return !activeChar.previousElementSibling
}

function checkWordEnd(): boolean {
    return !activeChar.nextElementSibling
}

function setNextWord() {
    activeChar = ((activeChar.parentElement as HTMLElement).nextElementSibling as HTMLElement).firstChild as HTMLElement
}

function setPreviousWord() {
    if ((activeChar.parentElement as HTMLElement).previousElementSibling) {
        const previousWordChar = Array.from(((activeChar.parentElement as HTMLElement).previousElementSibling as HTMLElement).querySelectorAll('.correct, .incorrect')).pop()
        if (previousWordChar) activeChar = previousWordChar as HTMLElement
        if (activeChar.nextElementSibling) activeChar = activeChar.nextElementSibling as HTMLElement
    }
}

function setNextChar() {
    if (activeChar.nextElementSibling) {
        activeChar = activeChar.nextElementSibling as HTMLElement
    }
}

function setPreviousChar() {
    if (checkWordStart()) {
        setPreviousWord()
        return
    }
    activeChar = activeChar.previousElementSibling as HTMLElement
}

function addExtraChar(data: string) {
    const extraChar = document.createElement("span")
    extraChar.classList.add("letter", "extra", "incorrect")
    extraChar.innerText = data as string
    activeChar.parentElement?.appendChild(extraChar)
    setNextChar()
}

function deleteExtraChar() {
    setPreviousChar()
    const nextElement = activeChar.nextElementSibling
    if (nextElement && nextElement.matches(".extra")) {
        nextElement.remove()
    }
}

function updateActiveChar(data: string | null, inputType: string): string {
    let returnValue = "invalid"

    if (checkForbiddenInput(inputType)) return returnValue

    if (inputType == "deleteContentBackward") {
        returnValue = "backspace"
        if (!(checkWordEnd() && activeChar.matches(".correct, .incorrect"))) {
            setPreviousChar()
            if (checkWordEnd()) return returnValue
        }
        if (activeChar.matches(".extra")) {
            deleteExtraChar()
            return returnValue
        }
        activeChar.classList.remove("correct", "incorrect")
        return returnValue
    }

    if (data == " ") {
        if (!checkWordStart() || (activeChar.parentElement?.innerText.length == 1 && activeChar.matches(".correct, .incorrect"))) {
            returnValue = "correct"
            if (!(checkWordEnd() && activeChar.matches(".correct, .incorrect"))) returnValue = "incorrect"
            setNextWord()
        }
        return returnValue
    }

    if (data == activeChar.innerHTML && !activeChar.matches(".correct, .incorrect")) {
        activeChar.classList.add("correct")
        returnValue = "correct"
    }
    else {
        returnValue = "incorrect"
        if (checkWordEnd() && activeChar.matches(".correct, .incorrect")) {
            addExtraChar(data as string)
            return returnValue
        }
        activeChar.classList.add("incorrect")
    }
    setNextChar()
    return returnValue
}

function updateWordState(char: HTMLElement) {
    if (checkWordEnd() && char.matches(".correct, .incorrect")) {
        getFullWordState(char.parentElement as HTMLElement)
    }
    else if (checkWordStart() && (char.parentElement as HTMLElement).previousElementSibling) {
        getFullWordState((char.parentElement as HTMLElement).previousElementSibling as HTMLElement)
    }
    else getPartialWordState(char.parentElement as HTMLElement)
}

function getFullWordState(word: HTMLElement) {
    const wordChars = word.children
    const wordLen = wordChars.length
    let correctCharsCount = 0
    for (let i = 0; i < wordLen; i++) {
        if (wordChars[i].matches(".correct")) {
            correctCharsCount++
        }
    }
    if (correctCharsCount !== wordLen) {
        word.classList.add("incorrectWord")
    }
    else {
        word.classList.remove("incorrectWord")
    }
}

function getPartialWordState(word: HTMLElement) {
    const wordChars = word.children
    const wordLen = wordChars.length
    let check = true
    for (let i = 0; i < wordLen; i++) {
        if (wordChars[i].matches(".incorrect")) {
            word.classList.add("incorrectWord")
            check = false
        }
    }
    if (check) {
        word.classList.remove("incorrectWord")
    }
}

function updateHTMLStats(object: testStats.Test) {
    (document.querySelector("#wpm") as HTMLElement).innerText = `${Math.round(object.wpm)}`;
    (document.querySelector("#raw-wpm") as HTMLElement).innerText = `${Math.round(object.rawWpm)}`;
    (document.querySelector("#accuracy") as HTMLElement).innerText = `${Math.round(object.accuracy * 100)}`;
}