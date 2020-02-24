import { FirebaseError } from "firebase";
import firebase from "firebase";

export let userlogin_email_password = (email:string, password:string) => {

    return firebase.auth().signInWithEmailAndPassword(email, password).then((user:any)=>{
        if(user){
            return user.user;
        } else {
            throw new Error("User not logged in");
        }
    }).catch((err:FirebaseError)=>{
        throw err;
    });
};

export let userlogin_google_oauth = () => {

};