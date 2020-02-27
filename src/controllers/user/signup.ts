import { User } from "firebase";
import firebase from "firebase";
import { stringify } from "querystring";
import { FirebaseUser } from "../../models/user";
import { userlogin_email_password } from "./login";

// This function will login a user who signs up with email and password and stores the user in 
export let usersignup = (user:Partial<FirebaseUser>)=> {
    if(user.email && user.password) {
        return firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(async () => {
            return await userlogin_email_password(user.email!, user.password!);
        });
    };
    throw new Error("The user was not signed up.");     
};