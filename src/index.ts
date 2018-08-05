#! /usr/bin/env node

import moment, {Duration} from 'moment';
import Week from './Processing/Week';
import Config from './Utils/Config';
import updateCheck from './Utils/updateCheck';

(async () => {
    updateCheck();

    await Config.get();

    const week: Week = new Week();
    week.weeksInPast = 0;

    // let times = await week.getTimes();
    // console.log({
    //     work: convertTime(times.work),
    //     break: convertTime(times.break),
    // });

    // TODO: time left in day

    const left = await week.getTimeLeft();
    const exact = moment().add(left).format('HH:mm');

    console.log(`Finish: ${left.humanize(true)} (${exact})`);
})();

function convertTime(inp: Duration) {
    return `${Math.floor(inp.asHours())}h ~${inp.minutes()}m`;
}
