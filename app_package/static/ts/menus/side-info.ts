import * as types from "../utils/test.types"
import { currentTest } from "../index"
import * as input from "../test/input"

function generateLeaderboards(leaderboards: types.Leaderboards) {
    const tables = document.querySelector("#leaderboards .tables")
    tables?.querySelectorAll(".data").forEach(function(data) {
        data.remove()
    })

    for (const mode in (leaderboards)) {
        const table = tables?.querySelector(`.time${mode}`)
        for (const rank in leaderboards[mode as keyof types.Leaderboards]) {
            const row = document.createElement("tr")
            row.classList.add("data")

            const rankData = document.createElement("td")
            rankData.innerText = `${rank}`

            const usernameData = document.createElement("td")
            usernameData.innerText = leaderboards[mode as keyof types.Leaderboards][rank as keyof types.UserList].username

            const wpmData = document.createElement("td")
            wpmData.innerText = `${leaderboards[mode as keyof types.Leaderboards][rank as keyof types.UserList].wpm}`

            const accuracyData = document.createElement("td")
            const accuracyValue = +leaderboards[mode as keyof types.Leaderboards][rank as keyof types.UserList].accuracy
            accuracyData.innerText = `${(Math.round(accuracyValue * 1000) / 10).toFixed(1)}`

            const dateData = document.createElement("td")
            const date = new Date(leaderboards[mode as keyof types.Leaderboards][rank as keyof types.UserList].timestamp)
            const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
            dateData.innerText = dateString

            row.appendChild(rankData)
            row.appendChild(usernameData)
            row.appendChild(wpmData)
            row.appendChild(accuracyData)
            row.appendChild(dateData)
            table?.appendChild(row)
        }
    }
}

async function getLeaderboards() {
    let leaderboards: types.Leaderboards
    await fetch("/api/leaderboards")
    .then((response) => response.json())
    .then((result) => {
        leaderboards = result
    })
    .then(() => {
        generateLeaderboards(leaderboards)
    })
    .catch(() => {
        throw new Error("Leaderboards fetch failed")
    })
}

function generateProfileInfo(profileInfo: types.ProfileInfo) {
    const profile = document.querySelector("#profile")?.querySelector(".profile-info")
    const highscores = profile?.querySelector(".highscores")
    const stats = profile?.querySelector(".stats")
    const historyTable = profile?.querySelector(".history")?.querySelector("table")

    for (const key in profileInfo["highscores"]) {
        for (const subkey in profileInfo["highscores"][key]) {
            const span = highscores?.querySelector(`.${key}${subkey}`)?.querySelector(".score") as HTMLSpanElement
            span.innerText = `${profileInfo["highscores"][key][subkey].toFixed(1)}`
        }
    }

    for (const key in profileInfo["stats"]) {
        for (const subkey in profileInfo["stats"][key]) {
            let value = `${profileInfo["stats"][key][subkey]}`
            if (key == "accuracy") {
                value = (Math.round(+value * 1000) / 10).toFixed(1)
            }
            else if (key == "wpm" || key == "rawwpm") {
                value = (+value).toFixed(1)
            }
            else if (subkey == "completed") {
                value = [profileInfo["stats"][key][subkey], `(${Math.round(profileInfo["stats"][key][subkey] / profileInfo["stats"][key]["started"] * 100)}%)`].join("")
            }
            const span = stats?.querySelector(`.${key}`)?.querySelector(`.stats-${subkey}`) as HTMLSpanElement
            span.innerText = `${value}`
        }
    }

    historyTable?.querySelectorAll(".data").forEach(function(data) {
        data.remove()
    })

    for (const key in profileInfo["history"]) {
        const row = document.createElement("tr")
        row.classList.add("data")

        const wpmData = document.createElement("td")
        wpmData.innerText = `${profileInfo["history"][key].wpm.toFixed(1)}`

        const rawwpmData = document.createElement("td")
        rawwpmData.innerText = `${profileInfo["history"][key].rawwpm.toFixed(1)}`

        const accuracyData = document.createElement("td")
        const accuracyValue = +profileInfo["history"][key].accuracy
        accuracyData.innerText = `${(Math.round(accuracyValue * 1000) / 10).toFixed(1)}`

        const charsData = document.createElement("td")
        const charsValue = `${profileInfo["history"][key].charsCorrectCorrectword}(${profileInfo["history"][key].charsCorrectCorrectword + profileInfo["history"][key].charsCorrectIncorrectword}) / ${profileInfo["history"][key].charsIncorrect} / ${profileInfo["history"][key].charsExtra} / ${profileInfo["history"][key].charsMissed}`
        charsData.innerText = charsValue

        const modeData = document.createElement("td")
        const modeValue = (() => {
            if (profileInfo["history"][key].mode == "words") {
                return [profileInfo["history"][key].mode, profileInfo["history"][key].words].join(" ")
            }
            else if (profileInfo["history"][key].mode == "time") {
                return [profileInfo["history"][key].mode, profileInfo["history"][key].time].join(" ")
            }
            return "custom mode"
        })()
        modeData.innerText = modeValue

        const languageData = document.createElement("td")
        languageData.innerText = `${profileInfo["history"][key].language}`

        const dateData = document.createElement("td")
        const date = new Date(profileInfo["history"][key].date)
        const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)
        dateData.innerText = dateString

        row.appendChild(wpmData)
        row.appendChild(rawwpmData)
        row.appendChild(accuracyData)
        row.appendChild(charsData)
        row.appendChild(modeData)
        row.appendChild(languageData)
        row.appendChild(dateData)

        historyTable?.appendChild(row)
    }
}

async function getProfileInfo() {
    let profileInfo: types.ProfileInfo
    await fetch("/api/profile")
    .then((response) => response.json())
    .then((result) => {
        profileInfo = result
    })
    .then(() => {
        generateProfileInfo(profileInfo)
    })
    .catch(() => {
        throw new Error("Profile fetch failed")
    })
}

export function initSideInfo() {
    const leaderboardsButton = document.querySelector('[title="leaderboards"]')
    const profileButton = document.querySelector('[title="profile"]')
    const index = document.querySelector("#index")
    const sideInfo = document.querySelector("#side-info")
    const profile = sideInfo?.querySelector("#profile")
    const leaderboards = sideInfo?.querySelector("#leaderboards")
    const backButton = sideInfo?.querySelector("svg")

    leaderboardsButton?.addEventListener("click", function() {
        if (currentTest.testStats.state == "active") {
            input.cancelTest(currentTest.testStats)
            currentTest.resetTest()
        }
        profile?.classList.add("hidden")
        leaderboards?.classList.remove("hidden")
        index?.classList.add("hidden")
        sideInfo?.classList.remove("hidden")
        getLeaderboards();
    })

    profileButton?.addEventListener("click", function() {
        if (currentTest.testStats.state == "active") {
            input.cancelTest(currentTest.testStats)
            currentTest.resetTest()
        }
        leaderboards?.classList.add("hidden")
        profile?.classList.remove("hidden")
        index?.classList.add("hidden")
        sideInfo?.classList.remove("hidden")
        getProfileInfo();
    })

    backButton?.addEventListener("click", function() {
        index?.classList.remove("hidden")
        sideInfo?.classList.add("hidden")
        leaderboards?.classList.add("hidden")
        profile?.classList.add("hidden")
    })
}