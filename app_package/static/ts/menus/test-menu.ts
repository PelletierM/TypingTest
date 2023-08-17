import { currentTest } from "../index"

const testResetButton = document.querySelector(".test-reset")

export function initTestMenu() {
    testResetButton?.addEventListener("click", () => currentTest.resetTest())
}
