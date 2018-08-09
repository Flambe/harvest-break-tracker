#! /usr/bin/env node

import program from 'commander';
import time from './Commands/time';

(async () => {
    program.version(require('../package.json').version)
        .option('-w, --weeks <n>', 'Weeks to include', parseInt, 0)
        .option('-r, --refresh', 'Refresh every minute')
        .option('-t, --table', 'Display as a table')
        .action(time);

    program.parse(process.argv);
})();
