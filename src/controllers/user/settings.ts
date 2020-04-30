import { getRepository } from "fireorm";
import { User } from "../../models";
import CurrentUser from "../user";
import { UserSettings } from "../../models/user";

// returns the user with updated settings
export let update_settings = async (input_settings:Partial<UserSettings>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let user_repo = getRepository(User);
    for (let index in input_settings) {
        curr_user.settings[index] = input_settings[index];
    }
    if(curr_user.timer.current_task){
        await curr_user.timer.current_task.promise;
    }
    return await user_repo.update(curr_user);
}

// returns the user's settings
export let get_settings = async (): Promise<UserSettings> =>{
    let curr_user = await CurrentUser.get_loggedin();
    let user_settings = curr_user.settings;
    return user_settings;
}