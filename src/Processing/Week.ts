import Day from './Day';
import moment, {Duration} from 'moment';
import HarvestWrapper from '../Utils/HarvestWrapper';

export default class Week {
    private days: Day[] = [];
    private start: moment.Moment = moment().startOf('isoWeek');
    private end: moment.Moment = moment();

    set weeksInPast(value: number) {
        this.start = moment().subtract(value, 'weeks').startOf('isoWeek');
    }

    public async getTimes(): Promise<{ work: Duration, break: Duration }> {
        const current: moment.Moment = this.start.clone();
        const entries = await HarvestWrapper.getEntries(this.start, this.end);

        do {
            const currentDate = current.format('YYYY-MM-DD');
            const day = new Day();

            entries.time_entries.filter(time => time.spent_date === currentDate)
                .map((time) => day.addEntry(time));

            this.days.push(day);
            current.add(1, 'day');
        } while (current.isSameOrBefore(this.end));

        return this.calculateTotals();
    }

    private calculateTotals(): { work: Duration, break: Duration } {
        return this.days.reduce((previous, current) => {
            previous.work.add(current.work, 'hours');
            previous.break.add(current.break, 'hours');

            return previous;
        }, {work: moment.duration(), break: moment.duration()});
    }

}