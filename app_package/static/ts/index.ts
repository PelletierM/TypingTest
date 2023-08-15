/* Main typescript file */
import * as stats from "./stats/init-stats"
import * as test from "./test/init-test"
import * as menus from "./menus/init-menus"


const testStats = stats.initStats("time15", 15)
test.initTest(testStats)
menus.initMenus()