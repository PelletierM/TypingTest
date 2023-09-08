import { currentTest } from "../index"
import { preferences } from "../settings/preferences"
import * as input from "../test/input"

const testResetButton = document.querySelector(".test-reset")

export function initResetButton() {
    testResetButton?.addEventListener("click", () => {
        input.cancelTest(currentTest.testStats)
        currentTest.resetTest()
    })
}

export function updateTestMenu() {
    const testMenu = document.querySelector("#test-menu")
    testMenu?.querySelectorAll("button.active")?.forEach((button) => button.classList.remove("active"))

    testMenu?.querySelector(`[data-mode=${preferences["mode"]}]`)?.classList.add("active")
    testMenu?.querySelector(`[data-length-time="${preferences["length-time"]}"]`)?.classList.add("active")
    testMenu?.querySelector(`[data-length-words="${preferences["length-words"]}"]`)?.classList.add("active")
    testMenu?.querySelector(`[data-language=${preferences["language"]}]`)?.classList.add("active")

    if (preferences["mode"] == "time") {
        testMenu?.querySelector("#test-lengths-words")?.classList.remove("active")        
        testMenu?.querySelector("#test-lengths-time")?.classList.add("active")
    } 
    else if (preferences["mode"] == "words") {
        testMenu?.querySelector("#test-lengths-time")?.classList.remove("active")
        testMenu?.querySelector("#test-lengths-words")?.classList.add("active")        
    } 
    else {
        testMenu?.querySelector("#test-lengths-time")?.classList.remove("active")
        testMenu?.querySelector("#test-lengths-words")?.classList.remove("active")         
    }
}

export function listenTestMenu() {
    const testModes = document.querySelector("#test-modes")
    const testLengthsTime = document.querySelector("#test-lengths-time")
    const testLengthsWords = document.querySelector("#test-lengths-words")
    const testLanguages = document.querySelector("#test-languages")

    testModes?.querySelectorAll(".optionSelector").forEach((selector) => {
        selector.addEventListener("click", function(e) {
            if ((e.target as HTMLButtonElement).matches(".active")) {
                return
            }
            preferences["mode"] = selector.getAttribute("data-mode") as string


            if (preferences["mode"] == "time") {
                preferences["length"] = parseInt(testLengthsTime?.querySelector(".active")?.getAttribute("data-length-time") as string)
            }
            else if (preferences["mode"] == "words") {
                preferences["length"] = parseInt(testLengthsWords?.querySelector(".active")?.getAttribute("data-length-words") as string)
            }

            updateTestMenu()
            currentTest.resetTest()
        })
    })

    testLengthsTime?.querySelectorAll(".optionSelector").forEach((selector) => {
        selector.addEventListener("click", function(e) {
            if ((e.target as HTMLButtonElement).matches(".active")) {
                return
            }
            preferences["length-time"] = parseInt(selector.getAttribute("data-length-time") as string)
            preferences["length"] = parseInt(selector.getAttribute("data-length-time") as string)

            updateTestMenu()
            currentTest.resetTest()
        })
    })

    testLengthsWords?.querySelectorAll(".optionSelector").forEach((selector) => {
        selector.addEventListener("click", function(e) {
            if ((e.target as HTMLButtonElement).matches(".active")) {
                return
            }
            preferences["length-words"] = parseInt(selector.getAttribute("data-length-words") as string)
            preferences["length"] = parseInt(selector.getAttribute("data-length-words") as string)

            updateTestMenu()
            currentTest.resetTest()
        })
    })

    testLanguages?.querySelectorAll(".optionSelector").forEach((selector) => {
        selector.addEventListener("click", function(e) {
            if ((e.target as HTMLButtonElement).matches(".active")) {
                return
            }
            preferences["language"] = selector.getAttribute("data-language") as string

            updateTestMenu()
            currentTest.resetTest()
        })
    })
}
