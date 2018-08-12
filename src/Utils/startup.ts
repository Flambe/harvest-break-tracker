import updateCheck from './updateCheck';
import Config from './Config';

export default async function startup() {
    updateCheck();

    await Config.init();
}