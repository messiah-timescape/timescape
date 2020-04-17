import { User } from "../../models";
import firebase from "firebase";
import { getRepository } from "fireorm";
import { BaseRepo } from "../../models/base_model";

class CurrentUser {
    static firebase_user?:firebase.User;
    static current_user?:User;
    static current_user_unsub?;
    static firebaseuser_set_promise?:Promise<never>;
    static user_set_promise?:Promise<never>;
    static init_currentuser() {
        if (this.firebase_user) {
            let resolved = false;
            this.user_set_promise = new Promise(resolve => {
                this.current_user_unsub = firebase
                .firestore().collection('user').doc(this.firebase_user!.uid).onSnapshot(user_snapshot => {
                    if (user_snapshot.exists){
                        this.current_user = (getRepository(User) as BaseRepo<User>).init_plain(user_snapshot);
                        if (this.current_user)
                            this.current_user.firebase_user = this.firebase_user;
                    }
                    if ( !resolved ) {
                        resolve();
                        resolved = true;
                    }
                });
            });
        }
    }

    static init_firebaseuser(){
        let resolved = false;
        this.firebaseuser_set_promise = new Promise( resolve => {
            firebase.auth().onAuthStateChanged(user => {
                if ( user ) {
                    this.firebase_user = user;
                    if ( this.current_user ) {
                        this.current_user.firebase_user = user;
                    } else {
                        this.init_currentuser();
                    }
                } else {
                    this.firebase_user = undefined;
                    this.current_user = undefined;
                }
                if ( !resolved ){
                    resolved = true;
                    resolve();
                }
            });
        });
    }

    static async get_user():Promise<User | undefined> {
        this.init_firebaseuser();
        
        if ( !this.current_user ){
            await this.firebaseuser_set_promise;
            await this.user_set_promise;
        }
        return this.current_user;
    }

    static async get_loggedin():Promise<User> {
        let current_user;
        if (this.current_user){
            current_user = this.current_user;
        } else {
            current_user = await this.get_user();
        }
        
        if ( current_user ) {
            return current_user;
        } else {
            throw new Error("User not logged in");
        }
    }
    
}


export default CurrentUser;