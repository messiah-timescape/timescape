import { FirebaseUser } from "../../models";

let current_user:FirebaseUser | undefined;
class CurrentUser {
    
    static set user(user: FirebaseUser) {
        console.log("USer Set")
        current_user = user;
    }

    static unset_user(): void {
        current_user = undefined;
    }

    static get_user():FirebaseUser | undefined {
        return current_user;
    }
    
}


export default CurrentUser;