import * as header from "./header"
import * as testMenu from "./test-menu"

export function initMenus() {
    header.initAuth()
    testMenu.initResetButton()
    testMenu.updateTestMenu()
    testMenu.listenTestMenu()
}