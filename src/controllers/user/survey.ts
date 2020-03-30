import { UserSettings } from "../../models/user";
import { update_settings } from "./settings";

// returns the user with set settings
export let store_survey = async (input_settings:Partial<UserSettings>) => {
    return update_settings(input_settings);
};