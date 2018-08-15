import Store from 'data-store';
import Init from './Configs/Init';
import ConfigurationInterface from './Configs/ConfigurationInterface';
import DefaultDisplay from './Configs/DefaultDisplay';

const store = new Store('harvest');
const versions: ConfigurationInterface[] = [
    new Init,
    new DefaultDisplay
];

export default class Config {
    static async init(): Promise<void> {
        for (const key in versions) {
            if (await versions[key].needsConfiguring()) {
                await versions[key].run();
            }
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