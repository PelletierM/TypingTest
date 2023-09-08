import { initAuth } from "./auth"
import { initSideInfo } from "./side-info"

export function initHeader() {
    initAuth()
    initSideInfo()
}