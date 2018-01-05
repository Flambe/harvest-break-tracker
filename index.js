#! /usr/bin/env node

const break_projects = {
    Break: null,
    'Non-Project Time': 'Education'
};

const Harvest = require('harvest'),
      moment = require('moment'),
      harvest = new Harvest(require('./config')),
      TimeTracking = harvest.TimeTracking,
      table = require("table"),
      colors = require('colors');

let loop = [],
    today = moment(),
    breaks = 0,
    time = 0,
    total = 0,
    time_today = {
        breaks: 0,
        time: 0,
        total: 0
    },
    runningExpected = 0;

startofweek = today.startOf('isoweek');

for (let i of Array(7).keys()) {
    let currentDay = startofweek.day(i + 1),
        now = moment(),
        isBefore = currentDay.isBefore(now, 'd'),
        isToday = currentDay.isSame(now, 'd');

    if (isBefore || isToday) {
        runningExpected += 8;
    }

    loop.push(daily(currentDay.toDate()).then(tasks => {
        for (let task of tasks.day_entries) {
            if (isToday) {
                time_today.total += task.hours;
            }
            total += task.hours;

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
    display(time_today.breaks, time_today.time, breaks, time);
}).catch(err => {
    console.error(err);
    console.error('Something went wrong, did you enter your harvest details?');
});

function display(breaks, time, weekly_breaks, weekly_time) {
    let data = [],
        options = {
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size - 1 || index === size;
            }
        },
        remaining = runningExpected - weekly_time;

    data.push(['', 'Day'.bold, 'Week'.bold]);
    data.push(['Break', formatDuration(breaks), formatDuration(weekly_breaks)]);
    data.push(['Time', formatDuration(time), formatDuration(weekly_time)]);

    if (remaining > 0) {
        data.push(['End', moment().add(remaining, 'hours').format('HH:mm'), '']);
    } else {
        data.push(['', "+ " + formatDuration(remaining * -1).green, '']);
    }

    let output = table.table(data, options);
    console.log(output)
}

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

function formatDuration(raw_duration) {
    let converted = getHoursMins(raw_duration),
        hours = converted.hours,
        minutes = converted.minutes;

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function getHoursMins(raw) {
    let time = Math.floor(raw),
        raw_minutes = raw % 1,
        minutes = Math.round(raw_minutes * 60);
    return {hours: time, minutes, minutes};
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
