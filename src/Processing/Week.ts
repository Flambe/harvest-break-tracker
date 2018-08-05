import Day from './Day';
import moment, {Duration} from 'moment';
import HarvestWrapper from '../Utils/HarvestWrapper';

export default class Week {
    private days: Day[] = [];
    private start: moment.Moment = moment().startOf('isoWeek');
    private end: moment.Moment = moment();

    set weeksInPast(value: number) {
        let week = moment().subtract(value, 'weeks');

        this.start = week.clone().startOf('isoWeek');
        this.end = week.clone().endOf('isoWeek');

        if (this.end.isAfter(moment())) {
            this.end = moment();
        }
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

    public async getTimeLeft(): Promise<moment.Duration> {
        const times = await this.getTimes();
        const hoursTotal = this.days.length * 8;
        const week = moment.duration(hoursTotal > 40 ? 40 : hoursTotal, 'hours');

        return week.subtract(times.work);
    }

    private calculateTotals(): { work: Duration, break: Duration } {
        return this.days.reduce((previous, current) => {
            previous.work.add(current.work, 'hours');
            previous.break.add(current.break, 'hours');

            return previous;
        }, {work: moment.duration(), break: moment.duration()});
    }

}