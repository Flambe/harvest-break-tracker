#! /usr/bin/env node

import moment from 'moment';
import Week from './Processing/Week';
import Config from './Utils/Config';
import updateCheck from './Utils/updateCheck';
import program from 'commander';
import logUpdate from 'log-update';

program.version(require('../package.json').version)
    .option('-w, --weeks <n>', 'Weeks to include', parseInt, 0)
    .option('-r, --refresh', 'Refresh every minute')
    .parse(process.argv);

updateCheck();

const processTime = async () => {
    let weeksToProcess: number = program.weeks;
    const weeks: Week[] = [];

    while (weeksToProcess >= 0) {
        const week: Week = new Week();
        week.weeksInPast = weeksToProcess--;

        weeks.push(week);
    }

    await Config.get();

    const remaining: moment.Duration = moment.duration();

    for (const key in weeks) {
        const week: Week = weeks[key];
        remaining.add(await week.getTimeLeft());
    }

    const exact: string = moment().add(remaining).format('HH:mm');

    logUpdate(`Finish: ${remaining.humanize(true)} (${exact})`);
};

(async () => {
    await processTime();
})();

if (program.refresh) {
    setInterval(processTime, 60000);
}
