import * as test from "./test/init-test"
import * as menus from "./menus/init-menus"
import * as header from "./menus/init-header"
import { listenInput } from "./test/input"
import { resultsModalToggle } from "./test/results"

export const currentTest = new test.Test

header.initHeader()

currentTest.initTest()
listenInput()
menus.initMenus()
resultsModalToggle()