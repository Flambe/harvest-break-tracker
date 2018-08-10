import Store from 'data-store';
import inquirer from 'inquirer';
import HarvestWrapper from './HarvestWrapper';

const store = new Store('harvest');

export default class Config {
    static async init(spinner): Promise<void> {
        if (store.has('config')) {
            await HarvestWrapper.setHarvestConfig(store.get('config'));

            return;
        }

        spinner.stop();

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

        try {
            await HarvestWrapper.setHarvestConfig(result);
            store.set('config', result);
            console.log(':) Your harvest details are correct');
        } catch (e) {
            if (e.error) {
                console.error(e.error.error_description);
            }

            process.exit(1);
        }
    }

    static has(key) {
        return store.has(key);
    }

    static get(key) {
        return store.get(key);
    }

    static set(key, value) {
        store.set(key, value);
    }
}