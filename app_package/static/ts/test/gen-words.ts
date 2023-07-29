import * as types from "./test.types"
import { genCursor } from "./cursor"

const amount: number = 150
let fetchedObject: types.FetchedWordList
let wordList: types.WordItem[]

export async function getWordList(url: string = "/test/wordlist", currentList: string = "french_weighted") {
    await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(currentList)
    })
    .then((response) => response.json())
    .then((result) => {
        fetchedObject = result
    })
    .then(() => {
        wordList = sortFetched(fetchedObject)
        updateWords()
    })
    .catch(() => {
    throw new Error("Wordlist fetch failed")
    })
}

function sortFetched(fetchedObject: types.FetchedWordList): types.WordItem[] {
    const sortedList:types.WordItem[] = []
        for (const key in fetchedObject) {
            sortedList.push([key, fetchedObject[key]])
        }
    sortedList.sort(function(a:types.WordItem, b:types.WordItem): number {
        return a[1] - b[1];
    })
    return sortedList
}

function generateWords(amount: number): string[] {
    const words: string[] = []
    const wordListLen: number = wordList.length
    const maxRandom: number = wordList[wordListLen - 1][1]

    for (let i = 0; i < amount; i++) {
        const value: number = Math.floor((Math.random() * maxRandom) + 1)
        for (let i = 0; i < wordListLen; i++) {
            if (wordList[i][1] >= value) {
                words.push(wordList[i][0])
                break
            }
        }
    }
    return words
}

export function updateWords() {
    const divWords = document.querySelector("#words")
    const words: string[] = generateWords(amount)
    if (divWords) {
        for (let i = 0; i < amount; i++) {
            const newDiv = document.createElement("div")
            newDiv.classList.add("word")
            const word: string = words[i]
            const wordLen: number = word.length
            for (let j = 0; j < wordLen; j++) {
                const newSpan = document.createElement("span")
                newSpan.innerText = word[j]
                newSpan.classList.add("letter")
                newDiv.appendChild(newSpan)
            }
            divWords.appendChild(newDiv)
        }
    genCursor()
    }
}

