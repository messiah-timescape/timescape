import { User } from "../../models";
import {Plugins} from "@capacitor/core";
import { getRepository } from "fireorm";
import firebase from "firebase";
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

    static async get_user():Promise<User | null> {
        let user_repo = getRepository(User);

        await new Promise(resolve => {
            firebase.auth().onAuthStateChanged(user => {
                resolve(null);
            });
        });
        
        let curr_user = firebase.auth().currentUser;
        
        if (!curr_user) {
            return new Promise(resolve => {
                resolve(null);
            });
        }
        return user_repo.whereEqualTo('user_id', curr_user.uid).findOne();
            
        // return Storage.get({key: USER_STORAGE_KEY}).then((user_obj:{value: string | null}) => {
        //     if ( user_obj.value ) {
        //         return User.create_from_json(user_obj.value);
        //     } else {
        //         throw new Error("No user");
        //     }
        // });
    }
    
}


export default CurrentUser;