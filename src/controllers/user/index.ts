import { User } from "../../models";
import firebase from "firebase";
import { getRepository } from "fireorm";

class CurrentUser {
    static firebase_user?:firebase.User;
    static current_user?:User;
    static current_user_unsub?;
    static on_change?:Function;

    static call_on_change(param) {
        if (this.on_change) {
            return this.on_change(param);
        }
    }

    static init_currentuser() {
        if (this.firebase_user) {
            this.current_user_unsub = firebase
            .firestore().collection('user').doc(this.firebase_user.uid).onSnapshot(user_snapshot => {
                if (user_snapshot.exists){
                    this.current_user = getRepository(User).init_plain(user_snapshot);
                    if (this.current_user)
                        this.current_user.firebase_user = this.firebase_user;
                    this.call_on_change(this.current_user);
                }
            });
        }
    }

    static init_firebaseuser(){
        let unsubscribe = firebase.auth().onAuthStateChanged(user => {
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
        });
    }

    static async get_user():Promise<User | null> {
        this.init_firebaseuser();
        
        let that = this;
        return new Promise(resolve => {
            if ( this.current_user ){
                resolve(this.current_user);
            } else {
                that.on_change = () => {
                    resolve(this.current_user);
                };
            }
        });
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