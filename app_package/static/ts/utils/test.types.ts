export interface testStats {
    mode: string
    language: string
    time: number | null
    words: number | null
    wpm: number
    rawWpm: number
    accuracy: number
    state: "inactive" | "active" | "completed" | "cancelled"
    inputStats: inputStats
    updateAccuracy: () => void
    updateWpm: () => void
}

export interface inputStats {
    correctInput: number
    incorrectInput: number
    wordCount: number
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

export interface Leaderboards {
    "15": UserList
    "60": UserList
}

export interface UserList {
    [propName: string]: TestResult
}

interface TestResult {
    username: string
    wpm: number
    accuracy: number
    timestamp: EpochTimeStamp
}

export interface ProfileInfo {
    "highscores": {
        [propName: string]: {
            [propName: string]: number
        }
    }
    "history": {
        [propName: string]: {
            wpm: number
            rawwpm: number
            accuracy: number
            mode: string
            time: number | null
            words: number | null
            language: string
            date: EpochTimeStamp
            charsCorrectCorrectword: number
            charsCorrectIncorrectword: number
            charsExtra: number
            charsIncorrect: number
            charsMissed: number
        }
    }
    "stats": {
        [propName: string]: {
            [propName: string]: number
        }
    }
}