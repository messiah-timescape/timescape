import moment from "moment";
import { update_settings, get_settings } from "./settings";
import init_app from "../../init_app";
import firebase from "firebase";
import Weekdays from "../../utils/weekdays";
import { UserSettings } from "../../models/user";
import { TestLoginActions } from "./login.test";
import CurrentUser from ".";
import * as Chance from "chance";
const chance = new Chance.Chance();

describe('Manipulate Settings', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    
    it('retrieves settings from user', async done=>{
        let settings:UserSettings = await get_settings();
        expect(settings).toBeInstanceOf(UserSettings);
        done();
    });

    it('updates the user\'s settings', async done=> {
        const h = chance.integer({min: 0, max: 23});
        const m = chance.integer({min: 0, max: 59});
        let settings:UserSettings = new UserSettings ({
            work_start_time: moment().hour(h).minute(m),
            work_stop_time: moment().hour(h).minute(m),
            sleep_start: moment().hour(h).minute(m),
            sleep_stop: moment().hour(h).minute(m),
            work_days: [Weekdays.Tuesday],
            overwork_limit: moment.duration(8, "hours")
        });
        let user = await update_settings(settings);
        let curr_user = await CurrentUser.get_loggedin();
        expect(user.settings).toBeInstanceOf(UserSettings);
        expect(curr_user.settings.work_start_time.isSame(user.settings.work_start_time)).toBeTruthy();
        done();
    });

    afterAll(()=>{
        firebase.auth().signOut();
    });
});
