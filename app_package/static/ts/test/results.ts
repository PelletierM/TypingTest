import * as types from "../utils/test.types"
import { currentTest } from "../index"

export async function sendResults(testStats: types.testStats, url: string = "/test/results") {
    const testStatsJSON = JSON.stringify(testStats)
    await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: testStatsJSON
    })
    return;
}

const resultContainer = document.querySelector("#test-results") as HTMLElement
const modeContainer = resultContainer?.querySelector(".mode > span.result") as HTMLSpanElement
const languageContainer = resultContainer?.querySelector(".language > span.result") as HTMLSpanElement
const wpmContainer = resultContainer?.querySelector(".wpm > span.result") as HTMLSpanElement
const rawWpmContainer = resultContainer?.querySelector(".raw-wpm > span.result") as HTMLSpanElement
const accuracyContainer = resultContainer?.querySelector(".accuracy > span.result") as HTMLSpanElement
const charsContainer = resultContainer?.querySelector(".chars > span.result") as HTMLSpanElement

export function showResults(testStats: types.testStats) {
    resultContainer.parentElement?.classList.add("active")
    modeContainer.innerText = (() => {
        if (testStats.time) {
            return [testStats.mode, testStats.time].join(" ")
        }
        else if (testStats.words) {
            return [testStats.mode, testStats.words].join(" ")
        }
        return "custom"
    })()
    languageContainer.innerText = `${testStats.language}`
    wpmContainer.innerText = `${(Math.round(testStats.wpm * 10) / 10).toFixed(1)}`
    rawWpmContainer.innerText = `${(Math.round(testStats.rawWpm * 10) / 10).toFixed(1)}`
    accuracyContainer.innerText = `${(Math.round(testStats.accuracy * 1000) / 10).toFixed(1)}%`
    charsContainer.innerText = `${testStats.inputStats.wpmStats.correctWordsCorrectChars}(${testStats.inputStats.wpmStats.correctWordsCorrectChars + testStats.inputStats.wpmStats.incorrectWordsCorrectChars}) / ${testStats.inputStats.wpmStats.incorrectChars} / ${testStats.inputStats.wpmStats.extraChars} / ${testStats.inputStats.wpmStats.missedChars}`
}

export function resultsModalToggle() {
    const modal = document.querySelector("#test-results")?.parentElement
    const modalExitButton = modal?.querySelector(".exit")
    modal?.addEventListener("click", function(e) {
        if (e.target !== modal) return
        modal.classList.remove("active")
        document.querySelector("#test-info")?.classList.remove("active")
        currentTest.resetTest()
    });
    modalExitButton?.addEventListener("click", function() {
        modal?.classList.remove("active")
        document.querySelector("#test-info")?.classList.remove("active")
        currentTest.resetTest()
    });
}