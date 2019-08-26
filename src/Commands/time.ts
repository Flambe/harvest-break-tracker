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

require('colors');

export default async () => {
    const spinner = ora().start();
	const systray: Systray = program.tray && new Systray();

    if (program.tray) {
        systray.title = 'starting...';
    }

    const processTime = async (manual: boolean = false) => {
        if (manual && program.tray) {
            systray.title = 'refreshing...';
        }

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
    };

    await processTime();

	if (program.refresh || program.tray) {
        setInterval(processTime, 60_000);
    }

    if (program.tray) {
        systray.refresh = processTime;
    }
};
