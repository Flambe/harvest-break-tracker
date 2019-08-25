import Renderer from './Renderer';
import moment from 'moment';
import logUpdate from 'log-update';
import * as table from 'table';
import {durationToHuman} from '../Utils/Utils';

export default class TableRenderer implements Renderer {
    private _times;

    set times(value) {
        this._times = value;
    }

    private _lastDay;

    set lastDay(value) {
        this._lastDay = value;
    }

    render(remaining, running: 'work' | 'break' | false): void {
        const exact: string = remaining.asMinutes() <= -30 ? (<any>'go home').rainbow : moment().add(remaining).format('HH:mm');
        const under = remaining > 0;
		const timeLeft: any = (under ? '' : '+') + durationToHuman(remaining);

        const weekTable = [
            ['', 'Day', 'Week'],
			['Break' + (running === 'break' ? ' *' : ''), durationToHuman(this._lastDay.break), durationToHuman(this._times.break)],
			['Work' + (running === 'work' ? ' *' : ''), durationToHuman(this._lastDay.work), durationToHuman(this._times.work)],
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
