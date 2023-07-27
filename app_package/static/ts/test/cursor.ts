let cursor: HTMLElement

export function genCursor() {
    const words = document.querySelector("#words")
    cursor = document.createElement("div")
    cursor.id = "cursor"
    words?.appendChild(cursor)
    updateCursor((words as HTMLElement).firstChild as HTMLElement)
}

export function updateCursor(element: HTMLElement) {
    cursor.style.top = `${element.offsetTop + element.offsetHeight}px`
    if (element.matches(".correct, .incorrect")) {
        cursor.style.left = `${element.offsetLeft + element.offsetWidth}px`
        return
    }
    cursor.style.left = `${element.offsetLeft}px`
}