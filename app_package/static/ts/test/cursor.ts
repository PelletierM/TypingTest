let cursor: HTMLElement

export function genCursor() {
    const words = document.querySelector("#words")
    cursor = document.createElement("div")
    cursor.id = "cursor"
    words?.appendChild(cursor)
    updateCursor((words as HTMLElement).firstChild as HTMLElement)
}

export function updateCursor(element: HTMLElement) {
    stopCursorBlinking()
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