let activeChar: Element

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
            activeChar = ((document.querySelector("#words") as Element).firstChild as Element).firstChild as Element
        }
        updateActiveChar(data, inputType);
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
    activeChar = ((activeChar.parentElement as Element).nextElementSibling as Element).firstChild as Element
}

function setPreviousWord() {
    if ((activeChar.parentElement as Element).previousElementSibling) {
        const previousWordChar = Array.from(((activeChar.parentElement as Element).previousElementSibling as Element).querySelectorAll('.correct, .incorrect')).pop()
        if (previousWordChar) activeChar = previousWordChar
        if (activeChar.nextElementSibling) activeChar = activeChar.nextElementSibling
    }
}

function setNextChar() {
    if (activeChar.nextElementSibling) {
        activeChar = activeChar.nextElementSibling
    }
}

function setPreviousChar() {
    if (checkWordStart()) {
        setPreviousWord()
        return
    }
    activeChar = activeChar.previousElementSibling as Element
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