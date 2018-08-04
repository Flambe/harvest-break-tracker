import Harvest from 'harvest-v2';
import * as moment from 'moment';

export type HarvestConfig = { account_ID: number, access_token: string, user_agent: string };

export default class HarvestWrapper {
    private static _user_id: number = 0;
    private static _harvest: any;

    public static async setHarvestConfig(config: HarvestConfig) {
        HarvestWrapper._harvest = new Harvest(config);
        await HarvestWrapper.getUserId();
    }

    public static async getEntries(from: moment.Moment, to: moment.Moment): Promise<any> {
        return await HarvestWrapper._harvest.timeEntries.listBy({
            user_id: HarvestWrapper._user_id,
            from: from.toISOString(),
            to: to.toISOString()
        });
    }

    private static async getUserId() {
        HarvestWrapper._user_id = (await HarvestWrapper._harvest.users.retrieve('me')).id;
    }
}