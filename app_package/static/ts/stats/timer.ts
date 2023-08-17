import * as types from "../test/test.types"
import { updateStatsTimer, completeTest } from "../test/input"

export function generateTimer(time: number) {
    const oldTimer = document.querySelector("#timer") as HTMLElement;
    oldTimer?.remove()

    const timer = document.createElement("div")
    timer.innerText = `${time}`
    timer.id = "timer"
    document.querySelector("#stats")?.appendChild(timer)
}

export function startTimer(testStats: types.testStats) {
    const timer = document.querySelector("#timer") as HTMLElement
    const testTime: number = testStats.time
    let timerValue: number = testTime;
    testStats.inputStats.timerID = setInterval(updateTimer, 1000)
    
    function updateTimer() {
        updateStatsTimer(testStats)
        if (timer && timerValue > 0) {
            timerValue = timerValue - 1
            timer.innerText = `${timerValue}`           
        }
        if (testTime * 1000 <= (Date.now() - testStats.inputStats.startTime)) {
            completeTest(testStats)
        }
    }
}