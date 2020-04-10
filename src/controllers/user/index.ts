import { User } from "../../models";
import { getRepository } from "fireorm";
import firebase from "firebase";

class CurrentUser {

    static async get_user():Promise<User | null> {
        let user_repo = getRepository(User);

        let curr_user = firebase.auth().currentUser;
        if ( !curr_user ){
            await new Promise(resolve => {
                firebase.auth().onAuthStateChanged(user => {
                    resolve(null);
                });
            });
        }
        
        curr_user = firebase.auth().currentUser;
        
        if (curr_user === null) {
            return new Promise(resolve => {
                resolve(null);
            });
        }
        
        return user_repo.findById(curr_user.uid).then((user)=> {
            if (user && curr_user)
                user.firebase_user = curr_user;
            return user;
        });
    }

    static async get_loggedin():Promise<User> {
        let current_user = await this.get_user();
        
        if ( current_user ) {
            // if(current_user.timer.current_task && !current_user.timer.current_task.model ) {
            //     console.log(current_user.timer.current_task);
            //     await current_user.timer.current_task.promise.then(
            //         task => console.log(task)
            //     );
            // }
            // if(current_user.timer.current_task){
            //     await current_user.timer.current_task.promise;
            // }
            return current_user;
        } else {
            throw new Error("User not logged in");
        }
    }
    
}


export default CurrentUser;