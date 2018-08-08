import inquirer from 'inquirer';
import Config from '../Utils/Config';

export default async (type) => {
    if (['break'].indexOf(type) === -1) {
        console.error('! Config type not found, did you mean \'break\'?');
        return;
    }

    console.log('Setting a default break time for a project');

    const result = await inquirer.prompt([
        {
            type: 'input',
            name: 'project',
            message: 'Enter the harvest project name'
        },
        {
            type: 'input',
            name: 'task',
            message: 'Enter the harvest task name (leave blank for any)'
        },
        {
            type: 'input',
            name: 'minutes',
            message: 'Enter weekly aim in minutes'
        }
    ]);

    if (!result.project) {
        console.error('! Project name is required!');
        return;
    }

    let current: any[] = [];

    if (Config.has('aims')) {
        current = Config.get('aims');
    }

    current.push({
        project: result.project,
        task: result.task,
        minutes: result.minutes,
    });

    Config.set('aims', current);
};


// hbt config break