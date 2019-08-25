import * as moment from 'moment';
import {Duration} from 'moment';
import {isBreak} from '../Utils/Utils';

export default class Day {
    private _break: Duration = moment.duration(0, 'hours');

    get break(): Duration {
        return this._break;
    }

    private _work: Duration = moment.duration(0, 'hours');

    get work(): Duration {
        return this._work;
    }

    public addEntry(time: any): void {
		if (isBreak(time)) {
            this.incrementBreak(time.hours);
        } else {
            this.incrementWork(time.hours);
        }
    }

    private incrementWork(value: number) {
        this._work.add(value, 'hours');
    }

    private incrementBreak(value: number) {
        this._break.add(value, 'hours');
    }
}
