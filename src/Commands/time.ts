import moment from 'moment';
import Week from '../Processing/Week';
import program from 'commander';
import ora from 'ora';
import HarvestWrapper from '../Utils/HarvestWrapper';
import Config from '../Utils/Config';
import Renderer from '../Renderers/Renderer';
import SimpleRenderer from '../Renderers/SimpleRenderer';
import TableRenderer from '../Renderers/TableRenderer';
import Systray from '../Utils/Systray';
// @ts-ignore
import {MultiBar} from 'cli-progress';

require('colors');

export default async () => {
    let firstRun: boolean = true;
    let weeksToProcess: number = program.weeks;
    const total = weeksToProcess;
    const spinner = ora().start();
	const systray: Systray = program.tray && new Systray();
    const multibar: MultiBar = new MultiBar({
        clearOnComplete: true,
        hideCursor: true,
        format: '[{bar}] {value}/{total} weeks processed (ETA: {eta}s)',
        barIncompleteChar: ' ',
        barCompleteChar: '█',
        barsize: total < 40 ? total : 40,
    });

    if (program.tray) {
        systray.title = 'starting...';
    }

    const processTime = async (manual: boolean = false) => {
        if (manual && program.tray) {
            systray.title = 'refreshing...';
        }

        const weeks: Week[] = [];

        while (weeksToProcess >= 0) {
            const week: Week = new Week();
            week.weeksInPast = weeksToProcess--;

            weeks.push(week);
        }

        const remaining: moment.Duration = moment.duration();
        let bar: any;

        if (firstRun && total > 0) {
            spinner.stop();
            bar = multibar.create(total + 1, 0);
        }

        for (const key in weeks) {
            const week: Week = weeks[key];
            remaining.add(await week.getTimeLeft());

            if (firstRun && total > 0) {
                bar.increment(1);
            }
        }

        if (firstRun && total > 0) {
            multibar.stop();
        }

        const running = await HarvestWrapper.getRunning();

        spinner.stop();

        const displayAsTable = (program.display || Config.get('display')) === 'table';

        let renderer: Renderer;

        if (displayAsTable) {
            let currentWeek = weeks.pop() || new Week();
            renderer = new TableRenderer();
            (<TableRenderer>renderer).times = await currentWeek.getTimes();
            (<TableRenderer>renderer).lastDay = currentWeek.lastDay;
        } else {
            renderer = new SimpleRenderer();
        }

        renderer.render(remaining, running);

		if (program.tray) {
            systray.running = running;
			systray.remaining = remaining;
		}

        firstRun = false;
    };

    await processTime();

	if (program.refresh || program.tray) {
        setInterval(processTime, 60_000);
    }

    if (program.tray) {
        systray.refresh = processTime;
    }
};
