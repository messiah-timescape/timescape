import CurrentUser from "../user";
import { getRepository } from "fireorm";
import { User } from "../../models";
import Weekdays from "../../utils/weekdays";
import { Moment } from "moment";

export let store_survey = (work_limit:string, sleep_start:Moment, sleep_stop:Moment,
    work_days:Weekdays[], work_start:Moment, work_stop:Moment) => {
    let curr_user = CurrentUser.get_user();
    let user_repo = getRepository(User);
    curr_user.then(user=>{
        if(user) {
            user.settings.overwork_limit = work_limit;
            user.settings.sleep_start = sleep_start.toDate();
            user.settings.sleep_stop = sleep_stop.toDate();
            user.settings.work_days = work_days;
            user.settings.work_start_time = work_start.toDate();
            user.settings.work_stop_time = work_stop.toDate();
            return user_repo.update(user);
        }      
    }).catch((err)=>{
        throw err;
    });
}