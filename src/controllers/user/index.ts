import { User } from "../../models";
import { getRepository } from "fireorm";
import firebase from "firebase";

class CurrentUser {
    static firebase_user?:firebase.User;
    static current_user?:User;
    static current_user_unsub?;

    static init_currentuser() {
        if (this.firebase_user) {
            this.current_user_unsub = firebase
            .firestore().collection('user').doc(this.firebase_user.uid).onSnapshot(user_snapshot => {
                this.current_user = new User(user_snapshot.data());
                this.current_user.firebase_user = this.firebase_user;
            });
        }
    }

    static init_firebaseuser(){
        let unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if ( user ) {
                if ( this.current_user ) {
                    this.current_user.firebase_user = user;
                } else {
                    this.init_currentuser();
                }
            } else {
                this.current_user = undefined;
            }
        });
    }

    static async get_user():Promise<User | null> {
        this.init_firebaseuser();
        if ( !this.current_user_unsub ){
            await new Promise(resolve => {
                let unsubscribe = firebase.auth().onAuthStateChanged(user => {
                    unsubscribe();
                    resolve(null);
                });
            });
        }
        
        return new Promise(resolve => {
            resolve(this.current_user);
        })
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