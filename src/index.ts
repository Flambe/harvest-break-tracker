#! /usr/bin/env node

import moment from 'moment';
import Week from './Processing/Week';
import Config from './Utils/Config';
import updateCheck from './Utils/updateCheck';
import program from 'commander';
import logUpdate from 'log-update';
import ora from 'ora';
import HarvestWrapper from './Utils/HarvestWrapper';

(async () => {
    program.version(require('../package.json').version)
        .option('-w, --weeks <n>', 'Weeks to include', parseInt, 0)
        .option('-r, --refresh', 'Refresh every minute')
        .parse(process.argv);

    const spinner = ora().start();

    updateCheck();

    await Config.get();

    const processTime = async () => {
        let weeksToProcess: number = program.weeks;
        const weeks: Week[] = [];

        while (weeksToProcess >= 0) {
            const week: Week = new Week();
            week.weeksInPast = weeksToProcess--;

            weeks.push(week);
        }

        const remaining: moment.Duration = moment.duration();

        for (const key in weeks) {
            const week: Week = weeks[key];
            remaining.add(await week.getTimeLeft());
        }

        const exact: string = moment().add(remaining).format('HH:mm');

        spinner.stop();

        let string = `Finish: ${remaining.humanize(true)} (${exact})`;
        const running = await HarvestWrapper.getRunning();

        if (running) {
            string += ` * ${running} timer running`;
        }

        logUpdate(string);
    };

    await processTime();

    if (program.refresh) {
        setInterval(processTime, 60000);
    }
})();
