#! /usr/bin/env node
const break_projects = {
    Break: null,
    'Non-Project Time': 'Education'
};

const Harvest = require('harvest'),
    moment = require('moment'),
    harvest = new Harvest(require('./config')),
    TimeTracking = harvest.TimeTracking;

let loop = [],
    today = moment(),
    breaks = 0,
    time = 0,
    time_today = {
        breaks: 0,
        time: 0
    };

console.log('Getting times...');

for (let i of Array(7).keys()) {
    let currentDay = today.day(i + 1),
        isToday = currentDay.isSame(moment(), 'd');

    loop.push(daily(currentDay.toDate()).then(tasks => {
        for (let task of tasks.day_entries) {
            if (isBreakProject(task)) {
                breaks += task.hours;
                if (isToday) {
                    time_today.breaks += task.hours;
                }
            } else {
                time += task.hours;
                if (isToday) {
                    time_today.time += task.hours;
                }
            }
        }
    }));
}

Promise.all(loop).then(() => {
    console.log('\nWeek:');
    console.log('Break:', convertTime(breaks));
    console.log('Time:', convertTime(time));
    console.log('\nToday:');
    console.log('Break:', convertTime(time_today.breaks));
    console.log('Time:', convertTime(time_today.time));
}).catch(err => {
    console.error(err);
    console.error('Something went wrong, did you enter your harvest details?');
});

function daily(date) {
    return new Promise((resolve, reject) => {
        TimeTracking.daily({
            date
        }, (err, tasks) => {
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

function isBreakProject(task) {
    for (let key of Object.keys(break_projects)) {
        if (task.project !== key) {
            continue;
        }

        let tasks = break_projects[key];

        if (!tasks) {
            return true;
        }

        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }

        for (let t of tasks) {
            if (t === task.task) {
                return true;
            }
        }
    }

    return false;
}
