import CurrentUser from "../user";
import { getRepository } from "fireorm";
import { User } from "../../models";
import Weekdays from "../../utils/weekdays";
import { Moment } from "moment";
import { UserSettings } from "../../models/user";

export let store_survey = async (input_settings:UserSettings) => {
    let curr_user = await CurrentUser.get_loggedin();
    let user_repo = getRepository(User);
    for (let index in input_settings) {
        curr_user.settings[index] = input_settings[index];
    };
    console.log("From survey.ts Current User is ", curr_user);
    console.log("From survey.ts fields from User Settings ", curr_user.settings);
    console.log("What we get with the repo update ", await user_repo.update(curr_user));
    return await user_repo.update(curr_user);  
    
}