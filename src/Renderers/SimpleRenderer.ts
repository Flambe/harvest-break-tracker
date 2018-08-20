import Renderer from './Renderer';
import moment from 'moment';
import logUpdate from 'log-update';

export default class SimpleRenderer implements Renderer {
    render(remaining: moment.Duration, running: 'work' | 'break' | false): void {
        const exact: string = moment().add(remaining).format('HH:mm');
        let string = `Finish: ${remaining.humanize(true)} (${exact})`;

        if (running) {
            string += ` * ${running} timer running`;
        }

        logUpdate(string);
    }
}
