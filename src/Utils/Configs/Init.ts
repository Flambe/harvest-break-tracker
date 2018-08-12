import ConfigurationInterface from './ConfigurationInterface';
import Config from '../Config';
import HarvestWrapper from '../HarvestWrapper';
import inquirer from 'inquirer';
import ora from 'ora';

export default class Init implements ConfigurationInterface {
    async needsConfiguring(): Promise<boolean> {
        if (Config.has('config')) {
            await HarvestWrapper.setHarvestConfig(Config.get('config'));

            return false;
        }

        return true;
    }

    async run(): Promise<void> {
        console.log('! Couldn\'t find any existing harvest config');
        console.log('1. Go to https://id.getharvest.com/oauth2/access_tokens/new and log in');
        console.log('2. Type in a name for the token (E.G. hbt) and create it');

        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'access_token',
                message: 'Copy in the token from the \'Your Token\' field'
            },
            {
                type: 'input',
                name: 'account_ID',
                message: 'Copy in the number from the \'Account ID\' field'
            }
        ]);

        result.user_agent = 'Harvest Break Timer';
        result.account_ID = parseInt(result.account_ID, 10);

        const spinner = ora().start();

        try {
            await HarvestWrapper.setHarvestConfig(result);
            Config.set('config', result);
            spinner.stop();
            console.log(':) Your harvest details are correct');
        } catch (e) {
            spinner.stop();

            if (e.error) {
                console.error(e.error.error_description);
            }

            process.exit(1);
        }
    }
}