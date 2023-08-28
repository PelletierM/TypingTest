import { currentTest } from "../index"
import { cssFontSizes } from "../utils/css-variables"

let cursor: HTMLElement

export function genCursor() {
    const words = document.querySelector("#words")
    cursor = document.createElement("div")
    cursor.id = "cursor"
    words?.appendChild(cursor)
    updateCursor((words as HTMLElement).firstChild as HTMLElement)
}

function updateLineOffset(element: HTMLElement) {
    if (currentTest.testStats.state == "inactive") {
        (document.querySelector("#words") as HTMLElement).style.setProperty("top", `0px`)
        return;
    }

    if (currentTest.testStats.state == "active") {
        const offsetValue = (element.offsetTop - ((cssFontSizes.htmlFontSize * cssFontSizes.testLineHeightRatio) + (0.75 * cssFontSizes.htmlFontSize))) as number
        if (offsetValue >= 0) {
            (document.querySelector("#words") as HTMLElement).style.setProperty("top", `-${offsetValue}px`)
        }
    }
}


export function updateCursor(element: HTMLElement) {
    stopCursorBlinking()
    updateLineOffset(element)
    
    cursor.style.top = `${element.offsetTop + element.offsetHeight}px`
    if (element.matches(".correct, .incorrect")) {
        cursor.style.left = `${element.offsetLeft + element.offsetWidth}px`
        return
    }
    cursor.style.left = `${element.offsetLeft}px`
}

const stopCursorBlinking = (function () {
    let previousID: ReturnType<typeof setTimeout>
    
    function inner() {
        if (previousID) {
            clearTimeout(previousID)
        }
        cursor.classList.add("active")
        previousID = setTimeout(() => {
            cursor.classList.remove("active")
        }, 250)
    }
    return inner
})()