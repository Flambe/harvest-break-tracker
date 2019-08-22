#! /usr/bin/env node

import program from 'commander';
import time from './Commands/time';
import startup from './Utils/startup';

(async () => {
    await startup();

    program.version(require('../package.json').version)
        .option('-w, --weeks <n>', 'Weeks to include', parseInt, 0)
        .option('-r, --refresh', 'Refresh every minute')
        .option('-t, --table', 'Display the table view')
        .option('-s, --simple', 'Display the simple view')
		.option('-b, --bottom')
        .action(time);

    program.parse(process.argv);
})();
