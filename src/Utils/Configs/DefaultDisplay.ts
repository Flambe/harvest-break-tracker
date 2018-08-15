import ConfigurationInterface from './ConfigurationInterface';
import Config from '../Config';
import inquirer from 'inquirer';

export default class DefaultDisplay implements ConfigurationInterface {
    async needsConfiguring(): Promise<boolean> {
        return !Config.has('display');
    }

    async run(): Promise<void> {
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'display',
                message: 'Choose how you want to display the output by default',
                choices: ['table', 'simple'],
                default: 'table'
            }
        ]);

        Config.set('display', result.display);
    }
}