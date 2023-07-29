export function generateTimer(time: number) {
    const timer = document.createElement("div")
    timer.innerText = `${time}`
    timer.id = "timer"
    document.querySelector("#stats")?.appendChild(timer)
}

export function startTimer(time: number) {
    const timer = document.querySelector("#timer") as HTMLElement
    let timerValue: number = time;
    (function ticker() {
        if (timerValue > 0) {
            setTimeout(() => {
                timerValue = timerValue - 1
                timer.innerText = `${timerValue}`
                ticker()
            }, 1000)
        }
    })()
    return Date.now()
}