import * as types from "./test.types"

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
const modeContainer = resultContainer?.querySelector(".mode > span") as HTMLSpanElement
const languageContainer = resultContainer?.querySelector(".language > span") as HTMLSpanElement
const wpmContainer = resultContainer?.querySelector(".wpm > span") as HTMLSpanElement
const rawWpmContainer = resultContainer?.querySelector(".raw-wpm > span") as HTMLSpanElement
const accuracyContainer = resultContainer?.querySelector(".accuracy > span") as HTMLSpanElement
const charsContainer = resultContainer?.querySelector(".chars > span") as HTMLSpanElement

export function showResults(testStats: types.testStats) {
    resultContainer.parentElement?.classList.add("active")
    modeContainer.innerText = `${testStats.mode}`
    languageContainer.innerText = `${testStats.language}`
    wpmContainer.innerText = `${(Math.round(testStats.wpm * 10) / 10).toFixed(1)}`
    rawWpmContainer.innerText = `${(Math.round(testStats.rawWpm * 10) / 10).toFixed(1)}`
    accuracyContainer.innerText = `${(Math.round(testStats.accuracy * 1000) / 10).toFixed(1)}`
    charsContainer.innerText = `${testStats.inputStats.wpmStats.correctWordsCorrectChars}(${testStats.inputStats.wpmStats.correctWordsCorrectChars + testStats.inputStats.wpmStats.incorrectWordsCorrectChars}) / ${testStats.inputStats.wpmStats.incorrectChars} / ${testStats.inputStats.wpmStats.extraChars} / ${testStats.inputStats.wpmStats.missedChars}`
}