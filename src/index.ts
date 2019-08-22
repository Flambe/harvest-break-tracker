#! /usr/bin/env node

import program from 'commander';
import time from './Commands/time';
import startup from './Utils/startup';

(async () => {
    await startup();

    program.version(require('../package.json').version)
        .option('-w, --weeks <n>', 'Weeks to include', parseInt, 0)
        .option('-r, --refresh', 'Refresh every minute')
        .option('-d, --display <table|simple>', 'Render your time in table or simple view')
        .action(time);

    program.parse(process.argv);
})();
