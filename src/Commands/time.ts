import moment from 'moment';
import Week from '../Processing/Week';
import program from 'commander';
import ora from 'ora';
import HarvestWrapper from '../Utils/HarvestWrapper';
import Config from '../Utils/Config';
import Renderer from '../Renderers/Renderer';
import SimpleRenderer from '../Renderers/SimpleRenderer';
import TableRenderer from '../Renderers/TableRenderer';
import SysTray, {Menu} from 'systray';
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
		    const title: string = ' ' + ((remaining as any) > 0 ? '' : '+') + TableRenderer.convertTime(remaining) + ' | ' + (remaining.asMinutes() <= -30 ? 'go home' : moment().add(remaining).format('HH:mm'));
		    const menu: Menu = {
                icon,
                title,
                tooltip: 'What the hell does this do?',
                items: [{
                    title: 'stop',
                    tooltip: 'stop timer',
                    checked: false,
                    enabled: true
                }]
		    };

			if (systray) {
				systray.sendAction({
					type: 'update-menu',
					menu,
					seq_id: 1,
				});

				systray.onClick(action => {
                    systray.sendAction({
                        type: 'update-item',

                        item: {
                            ...action.item,
                            checked: !action.item.checked,
                        },
                        seq_id: action.seq_id,
                    })                });
			} else {
				systray = new SysTray({
					menu
				});
			}
		}
    };

    await processTime();

	if (program.refresh || program.tray) {
        setInterval(processTime, 60_000);
    }
};
