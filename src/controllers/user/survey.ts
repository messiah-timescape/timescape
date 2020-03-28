import CurrentUser from "../user";
import { getRepository } from "fireorm";
import { User } from "../../models";
import { UserSettings } from "../../models/user";

// returns the user with set settings
export let store_survey = async (input_settings:Partial<UserSettings>) => {
    let curr_user = await CurrentUser.get_loggedin();
    let user_repo = getRepository(User);
    for (let index in input_settings) {
        curr_user.settings[index] = input_settings[index];
    };
    return await user_repo.update(curr_user);
};

// returns the user's settings
export let get_survey = async () =>{
    let curr_user = await CurrentUser.get_loggedin();
    let user_settings = curr_user.settings;
    return user_settings;
}