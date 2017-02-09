let Harvest = require('harvest'),
    moment = require('moment'),
    harvest = new Harvest({
        subdomain: '',
        email: '',
        password: ''
    }),
    TimeTracking = harvest.TimeTracking;

let loop = [],
    today = moment(),
    breaks = 0,
    time = 0;

console.log('Getting times...');

for (let i of Array(7).keys()) {
    loop.push(daily(today.day(i + 1).toDate()).then(tasks => {
        for (let task of tasks.day_entries) {
            if ('Break' === task.project) {
                breaks += task.hours;
            } else {
                time += task.hours;
            }
        }
    }));
}

Promise.all(loop).then(() => {
    console.log('Break:', convertTime(breaks));
    console.log('Time:', convertTime(time));
}).catch(err => {
    console.error(err);
    console.error('Something went wrong, did you enter your harvest details?');
});

function daily(date) {
    return new Promise((resolve, reject) => {
        TimeTracking.daily({date}, (err, tasks) => {
            if (err) return reject(err);
            resolve(tasks);
        });
    });
}

function convertTime(raw) {
    let time = Math.floor(raw),
        raw_minutes = raw % 1,
        minutes = Math.round(raw_minutes * 60);

    return `${time} hour${time === 1 ? '' : 's'}, ${minutes} minute${minutes === 1 ? '' : 's'}`;
}
