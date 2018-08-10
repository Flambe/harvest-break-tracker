import Day from './Day';
import moment, {Duration} from 'moment';
import HarvestWrapper from '../Utils/HarvestWrapper';
import Config from '../Utils/Config';

export default class Week {
    private days: Day[] = [];
    private start: moment.Moment = moment().startOf('isoWeek');
    private end: moment.Moment = moment();
    private times;
    private aims: any[] = [];

    set weeksInPast(value: number) {
        let week = moment().subtract(value, 'weeks');

        this.start = week.clone().startOf('isoWeek');
        this.end = week.clone().endOf('isoWeek');

        if (this.end.isAfter(moment())) {
            this.end = moment();
        }
    }

    get lastDay() {
        return [...this.days].pop();
    }

    public async getTimes(): Promise<{ work: Duration, break: Duration }> {
        if (this.times) {
            return this.times;
        }

        const current: moment.Moment = this.start.clone();
        const entries = await HarvestWrapper.getEntries(this.start, this.end);
		this.aims = (Config.get('aims') || []).map(aim => {
            aim.minutes /= 5;

            return aim;
        });

        do {
            const currentDate = current.format('YYYY-MM-DD');
            const day = new Day();

            entries.time_entries.filter(time => time.spent_date === currentDate)
                .map((time) => {
                    const index = this.aims.findIndex((aim) => {
                        return time.project.name === aim.project && (!aim.task || time.task.name === aim.task);
                    });

                    if (index !== -1 && this.aims[index].minutes > 0) {
                        this.aims[index].minutes -= moment.duration(time.hours, 'hours').asMinutes();
                        if (this.aims[index].minutes < 0) {
                            this.aims[index].minutes = 0;
                        }
                    }

                    return day.addEntry(time);
                });

            this.days.push(day);
            current.add(1, 'day');
        } while (current.isSameOrBefore(this.end));

        const times = this.calculateTotals();

        this.times = times;

        return times;
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
        }, {work: moment.duration().subtract(this.getAimsTotal(), 'minutes'), break: moment.duration()});
    }

    private getAimsTotal(): number {
        return this.aims.reduce((previous, current) => previous + current.minutes, 0);
    }
}