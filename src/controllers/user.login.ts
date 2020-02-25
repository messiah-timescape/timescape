import { FirebaseError } from "firebase";
import firebase from "firebase";
import { User } from "../models";

export let userlogin_email_password = (email:string, password:string) => {

    return firebase.auth().signInWithEmailAndPassword(email, password).then((data:any)=>{
        if(data){
            let user = data.user;
            return new User({
                'email': user.email
            });
        } else {
            throw new Error("User not logged in");
        }
    }).catch((err:FirebaseError)=>{
        throw err;
    });
};

export let userlogin_google_oauth = () => {

};