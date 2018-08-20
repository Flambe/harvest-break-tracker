import Renderer from './Renderer';
import moment, {Duration} from 'moment';
import logUpdate from 'log-update';
import * as table from 'table';

export default class TableRenderer implements Renderer {
    private _times;

    set times(value) {
        this._times = value;
    }

    private _lastDay;

    set lastDay(value) {
        this._lastDay = value;
    }

    private static convertTime(inp: Duration) {
        const hours = Math.floor(Math.abs(inp.asHours()));
        let output = '';

        if (hours > 0) {
            output = `${hours}h `;
        }

        return `${output}${Math.abs(inp.minutes())}m`;
    }

    render(remaining, running: 'work' | 'break' | false): void {
        const exact: string = remaining.asMinutes() <= -30 ? (<any>'go home').rainbow : moment().add(remaining).format('HH:mm');
        const under = remaining > 0;
        const timeLeft: any = (under ? '' : '+') + TableRenderer.convertTime(remaining);


        const weekTable = [
            ['', 'Day', 'Week'],
            ['Break' + (running === 'break' ? ' *' : ''), TableRenderer.convertTime(this._lastDay.break), TableRenderer.convertTime(this._times.break)],
            ['Work' + (running === 'work' ? ' *' : ''), TableRenderer.convertTime(this._lastDay.work), TableRenderer.convertTime(this._times.work)],
        ];
        const todayTable = [
            [under ? 'Left' : 'Over', under ? timeLeft : timeLeft.green, exact]
        ];
        const options = {
            drawHorizontalLine: (index, size) => {
                return index < 2 || index === size;
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

        logUpdate(table.table(weekTable, options) + table.table(todayTable));
    }
}
