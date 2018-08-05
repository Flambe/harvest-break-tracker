import * as moment from 'moment';
import {Duration} from 'moment';

const breaks = {
    Break: null,
    'Non-Project Time': ['German']
};

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
        if (breaks[time.project.name] !== undefined) {
            if (!breaks[time.project.name] || breaks[time.project.name].indexOf(time.task.name) > -1) {
                this.incrementBreak(time.hours);

                return;
            }
        }
        this.incrementWork(time.hours);
    }

    private incrementWork(value: number) {
        this._work.add(value, 'hours');
    }

    private incrementBreak(value: number) {
        this._break.add(value, 'hours');
    }
}