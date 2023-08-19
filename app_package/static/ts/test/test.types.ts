export interface testStats {
    mode: string
    language: string
    time: number
    wpm: number
    rawWpm: number
    accuracy: number
    state: "inactive" | "active" | "completed" | "aborted"
    inputStats: inputStats
    updateAccuracy: () => void
    updateWpm: () => void
}

export interface inputStats {
    correctInput: number
    incorrectInput: number
    wpmStats: wpmStats
    startTime: number
    endTime: number
    timerID: ReturnType<typeof setInterval> | undefined
    updateInputCounts: (arg0: string) => void
    updateStats: (arg0: HTMLElement) => void
}

export interface wpmStats {
    correctWordsCorrectChars: number
    incorrectWordsCorrectChars: number
    incorrectChars: number
    extraChars: number
    missedChars: number
}

export type FetchedWordList = {[index:string]:number}
export type WordItem = [string, number]