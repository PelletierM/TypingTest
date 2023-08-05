/* Main typescript file */
import * as stats from "./stats/init-stats"
import * as test from "./test/init-test"


const testStats = stats.initStats("time15", 15)
test.initTest(testStats)