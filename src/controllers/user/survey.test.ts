import moment from "moment";
import { store_survey } from "./survey";
import init_app from "../../init_app";
import firebase from "firebase";
import Weekdays from "../../utils/weekdays";
import { Moment } from "moment";
import { UserSettings } from "../../models/user";
import { TestLoginActions } from "./login.test";
import CurrentUser from ".";
import * as Chance from "chance";
const chance = new Chance.Chance();

describe('Store User Survey Data', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    it('stores survey data', async ()=> {
        const h = chance.integer({min: 0, max: 23});
        const m = chance.integer({min: 0, max: 59});
        let settings:UserSettings = {
            work_start_time: moment().hour(h).minute(m).toDate(),
            work_stop_time: moment().hour(h).minute(m).toDate(),
            sleep_start: moment().hour(h).minute(m).toDate(),
            sleep_stop: moment().hour(h).minute(m).toDate(),
            work_days: [Weekdays.Tuesday],
            overwork_limit: "PT5H"
        }

        let user = await store_survey(settings);
        let curr_user = await CurrentUser.get_loggedin();
        return expect(curr_user.settings).toEqual(user.settings);
    });
    afterAll(()=>{
        firebase.auth().signOut();
    });
});