import * as test from "./test/init-test"
import * as menus from "./menus/init-menus"
import { listenInput } from "./test/input"

export const currentTest = new test.Test

currentTest.initTest()
listenInput()
menus.initMenus()