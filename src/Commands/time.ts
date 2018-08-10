import moment, {Duration} from 'moment';
import Week from '../Processing/Week';
import Config from '../Utils/Config';
import updateCheck from '../Utils/updateCheck';
import program from 'commander';
import logUpdate from 'log-update';
import ora from 'ora';
import HarvestWrapper from '../Utils/HarvestWrapper';
import * as table from 'table';

require('colors');

export default async () => {
    const spinner = ora().start();

    updateCheck();

    await Config.init(spinner);

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

        const running = await HarvestWrapper.getRunning();

        spinner.stop();

        if (program.table) {
            let currentWeek = weeks.pop() || new Week();
            displayTable(remaining, running, await currentWeek.getTimes(), currentWeek.lastDay);
        } else {
            display(remaining, running);
        }
    };

    await processTime();

    if (program.refresh) {
        setInterval(processTime, 60000);
    }
};

function display(remaining, running) {
    const exact: string = moment().add(remaining).format('HH:mm');
    let string = `Finish: ${remaining.humanize(true)} (${exact})`;

    if (running) {
        string += ` * ${running} timer running`;
    }

    logUpdate(string);
}

function displayTable(remaining, running, currentWeek, today) {
	const exact: string = remaining.asMinutes() <= -30 ? (<any>'go home').rainbow : moment().add(remaining).format('HH:mm');
	const under = remaining > 0;
	const timeLeft: any = (under ? '' : '+') + convertTime(remaining);


	const tableToDisplay = [
		['', 'Day', 'Week'],
		['Break' + (running === 'break' ? ' *' : ''), convertTime(today.break), convertTime(currentWeek.break)],
		['Work' + (running === 'work' ? ' *' : ''), convertTime(today.work), convertTime(currentWeek.work)],
		[under ? 'Left' : 'Over', under ? timeLeft : timeLeft.green, exact]
	];
    const options = {
        drawHorizontalLine: (index, size) => {
            return index < 2 || index > size - 2;
        },
        columns: {
            1: {
                alignment: 'right'
            },
            2: {
                alignment: 'right'
            }
        }
    };

    logUpdate(table.table(tableToDisplay, options));
}

function convertTime(inp: Duration) {
    const hours = Math.floor(Math.abs(inp.asHours()));
    let output = '';

    if (hours > 0) {
        output = `${hours}h `;
    }

    return `${output}${Math.abs(inp.minutes())}m`;
}