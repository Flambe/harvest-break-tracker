import moment from 'moment';
import Week from '../Processing/Week';
import program from 'commander';
import ora from 'ora';
import HarvestWrapper from '../Utils/HarvestWrapper';
import Config from '../Utils/Config';
import Renderer from '../Renderers/Renderer';
import SimpleRenderer from '../Renderers/SimpleRenderer';
import TableRenderer from '../Renderers/TableRenderer';
import SysTray from 'systray';
import icon from './icon';

require('colors');

export default async () => {
    const spinner = ora().start();
	let systray: SysTray;

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

        let displayAsTable = true;

        if (!program.table && (program.simple || Config.get('display') === 'simple')) {
            displayAsTable = false;
        }

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

		if (program.bottom) {
			if (systray) {
				systray.sendAction({
					type: 'update-menu',
					menu: {
						icon,
						title: ' ' + ((remaining as any) > 0 ? '' : '+') + TableRenderer.convertTime(remaining) + ' | ' + (remaining.asMinutes() <= -30 ? (<any>'go home').rainbow : moment().add(remaining).format('HH:mm')),
						tooltip: '',
						items: [],
					},
					seq_id: 1,
				});
			} else {
				systray = new SysTray({
					menu: {
						icon,
						title: ' ' + ((remaining as any) > 0 ? '' : '+') + TableRenderer.convertTime(remaining) + ' | ' + (remaining.asMinutes() <= -30 ? (<any>'go home').rainbow : moment().add(remaining).format('HH:mm')),
						tooltip: 'Tisdfsdfsps',
						items: [{
							title: 'stop',
							tooltip: 'stop timer',
							checked: false,
							enabled: true
						}]
					},
				});
			}
		}
    };

    await processTime();

	if (program.refresh || program.bottom) {
        setInterval(processTime, 60000);
    }
};
