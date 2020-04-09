import firebase from "firebase";
import { FirebaseUser, User } from "../../models/user";
import { userlogin_email_password } from "./login";
import CurrentUser from ".";
import { getRepository } from "fireorm";

// This function will login a user who signs up with email and password and stores the user in
export let usersignup = (user: Partial<FirebaseUser>) => {
  if (user.email && user.password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async () => {
        let login_promise = await userlogin_email_password(user.email!, user.password!);
        let curr_user = (await CurrentUser.get_loggedin());
        if (user.display_name){
          curr_user.display_name = user.display_name;
          await getRepository(User).update(curr_user);
        }
        let firebase_user = curr_user.firebase_user;
        if (firebase_user){
          firebase_user.updateProfile({
            displayName: user.display_name
          });
        }
        return login_promise;
      });
  }
  throw new Error("The user was not signed up.");
};
