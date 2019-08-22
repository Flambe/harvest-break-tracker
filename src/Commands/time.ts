import moment from 'moment';
import Week from '../Processing/Week';
import program from 'commander';
import ora from 'ora';
import HarvestWrapper from '../Utils/HarvestWrapper';
import Config from '../Utils/Config';
import Renderer from '../Renderers/Renderer';
import SimpleRenderer from '../Renderers/SimpleRenderer';
import TableRenderer from '../Renderers/TableRenderer';

require('colors');

export default async () => {
    const spinner = ora().start();

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
    };

    await processTime();

    if (program.refresh) {
        setInterval(processTime, 60000);
    }
};
