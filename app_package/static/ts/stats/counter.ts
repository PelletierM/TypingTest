import { updateStatsTimer, completeTest } from "../test/input"
import { currentTest } from "../index"

export function generateCounter() {
    if (currentTest.testStats.time) {
        generateTimer()
    }
    else if (currentTest.testStats.words) {
        generateWordCounter()
    }
}

function generateTimer() {
    const timer = document.querySelector("#counter > span") as HTMLSpanElement
    timer.innerText = `${currentTest.testStats.time}`
}

function generateWordCounter() {
    const timer = document.querySelector("#counter > span") as HTMLSpanElement
    timer.innerText = `${currentTest.testStats.inputStats.wordCount}/${currentTest.testStats.words}`
}

export function startTimer() {
    const timer = document.querySelector("#counter > span") as HTMLElement
    const testTime: number | null = currentTest.testStats.time
    let timerValue: number | null = testTime;
    currentTest.testStats.inputStats.timerID = setInterval(updateTimer, 1000)
    
    function updateTimer() {
        updateStatsTimer(currentTest.testStats)
        if (testTime) {
            if (timer && (timerValue as number) > 0) {
                timerValue = (timerValue as number) - 1
                timer.innerText = `${timerValue}`           
            }
            if (testTime * 1000 <= (Date.now() - currentTest.testStats.inputStats.startTime)) {
                completeTest(currentTest.testStats)
            }
        }
    }
}

export function updateCounter() {
    const counter = document.querySelector("#counter > span") as HTMLSpanElement
    counter.innerText = `${currentTest.testStats.inputStats.wordCount}/${currentTest.testStats.words}`
}