import { User } from "../../models";
import {Plugins} from "@capacitor/core";
const {Storage} = Plugins;

const USER_STORAGE_KEY = 'current_user';
class CurrentUser {
    
    static async set_user(user: User):Promise<void> {
        return await Storage.set({
            key: USER_STORAGE_KEY,
            value: user.to_json()
        });
    }

    static unset_user(): Promise<void> {
        return Storage.set({
            key: USER_STORAGE_KEY,
            value: ""
        });
    }

    static async get_user():Promise<User> {
        return Storage.get({key: USER_STORAGE_KEY}).then((user_obj:{value: string | null}) => {
            if ( user_obj.value ) {
                return User.create_from_json(user_obj.value);
            } else {
                throw new Error("No user");
            }
        });
    }
    
}


export default CurrentUser;