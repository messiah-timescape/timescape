import { User } from "../../models";
import { getRepository } from "fireorm";
import firebase from "firebase";

class CurrentUser {

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
    }

    static async get_loggedin():Promise<User> {
        let current_user = await this.get_user();
        
        if ( current_user ) {
            return current_user;
        } else {
            throw new Error("User not logged in");
        }
    }
    
}


export default CurrentUser;