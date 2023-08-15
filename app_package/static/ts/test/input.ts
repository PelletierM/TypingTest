import * as types from "./test.types"
import { updateCursor } from "./cursor"
import { startTimer } from "../stats/timer"

let activeChar: HTMLElement

export function listenInput(testStats: types.testStats) {
    const inputField = document.querySelector("#test-input") as HTMLInputElement
    
    // Listener for input focus
    const testContainer = document.querySelector("#test")
    testContainer?.addEventListener("focusin", function(e){
        e.preventDefault
        inputField.focus()
    })

    // Listener for typed inputs
    inputField?.addEventListener("input", function inputListener(e) {
        if (testStats.state === "completed") {
            inputField.removeEventListener("input", inputListener)
            return
        }
        if (testStats.state === "inactive") startTest(testStats, inputField, inputListener)

        const inputType = (e as InputEvent).inputType
        const data = (e as InputEvent).data

        testStats.inputStats.updateInputCounts(updateActiveChar(data, inputType));
        updateWordState(activeChar) 
        testStats.inputStats.updateStats(activeChar)

        updateCursor(activeChar)

        testStats.updateAccuracy()
        updateHTMLAccuracy(testStats)
        
        // reset input field value to single space
        const target = (e as InputEvent).target as HTMLInputElement        
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
    activeChar = activeChar.parentElement?.nextElementSibling?.firstChild as HTMLElement
}

function setPreviousWord() {
    if (activeChar.parentElement?.previousElementSibling) {
        const previousWordChar = Array.from(activeChar.parentElement?.previousElementSibling?.querySelectorAll('.correct, .incorrect')).pop()
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
    else if (checkWordStart() && char.parentElement?.previousElementSibling) {
        getFullWordState(char.parentElement?.previousElementSibling as HTMLElement)
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

function updateHTMLAccuracy(object: types.testStats) {
    (document.querySelector("#accuracy") as HTMLElement).innerText = `${Math.round(object.accuracy * 100)}`;
}

function updateHTMLWpm(object: types.testStats) {
    (document.querySelector("#wpm") as HTMLElement).innerText = `${Math.round(object.wpm)}`;
    (document.querySelector("#raw-wpm") as HTMLElement).innerText = `${Math.round(object.rawWpm)}`;
}

function startTest(object: types.testStats, field: HTMLElement, listener: EventListener) {
    activeChar = (document.querySelector("#words") as HTMLElement).firstChild?.firstChild as HTMLElement
    object.state = "active"
    object.inputStats.startTime = Date.now()
    startTimer(object.time)
    startStatsUpdate(object)
    setTimeout(() => endTest(object, field, listener), object.time * 1000)
}

function endTest(object: types.testStats, field: HTMLElement, listener: EventListener) {
    object.inputStats.endTime = ((object.time * 1000) + object.inputStats.startTime)
    object.updateAccuracy()
    object.updateWpm()
    object.state = "completed"
    field.removeEventListener("input", listener)
}

function startStatsUpdate(object: types.testStats) {
    (function innerFunc() {
        if (object.state === "completed") return
        setTimeout(() => {
            object.inputStats.updateStats(activeChar)
            object.updateWpm()
            updateHTMLWpm(object)
            innerFunc()
        }, 1000)
    })()
}
