import { updateCursor } from "./cursor"
import { startTimer } from "../stats/timer"

let activeChar: HTMLElement

export function listenInput() {
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
            startTimer(60)
        }
        updateActiveChar(data, inputType);
        updateCursor(activeChar)
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

function updateActiveChar(data: string | null, inputType: string) {
    if (checkForbiddenInput(inputType)) return
    if (inputType == "deleteContentBackward") {
        if (!(checkWordEnd() && activeChar.matches(".correct, .incorrect"))) {
            setPreviousChar()
            if (checkWordEnd()) return
        }
        if (activeChar.matches(".extra")) {
            deleteExtraChar()
            return
        }
        activeChar.classList.remove("correct", "incorrect")
        return
    }
    if (data == " ") {
        if (!checkWordStart() || (activeChar.parentElement?.innerText.length == 1 && activeChar.matches(".correct, .incorrect"))) {
            setNextWord()
        }
        return
    }
    if (data == activeChar.innerHTML && !activeChar.matches(".correct, .incorrect")) {
        activeChar.classList.add("correct")
    }
    else {
        if (checkWordEnd() && activeChar.matches(".correct, .incorrect")) {
            addExtraChar(data as string)
            return
        }
        activeChar.classList.add("incorrect")
    }
    setNextChar()
}