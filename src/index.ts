#! /usr/bin/env node

import {Duration} from 'moment';
import Week from './Processing/Week';
import Config from './Utils/Config';

(async () => {
    await Config.get();

    const week: Week = new Week();
    week.weeksInPast = 0;

    let times = await week.getTimes();
    console.log({
        work: convertTime(times.work),
        break: convertTime(times.break),
    });
})();

function convertTime(inp: Duration) {
    return `${Math.floor(inp.asHours())}h ~${inp.minutes()}m`;
}
