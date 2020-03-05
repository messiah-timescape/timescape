import { FirebaseError } from "firebase";
import firebase from "firebase";
import { FirebaseUser } from "../../models";
import CurrentUser from ".";

export let userlogin_email_password = (email: string, password: string) => {
  //frontend use

  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (data: firebase.auth.UserCredential) => {
      if (data && data.user) {
        let user = FirebaseUser.create_from_firebase(data.user);

        await user.user().then(user => {
          CurrentUser.set_user(user);
        });
        return user;
      } else {
        throw new Error("User not logged in");
      }
    })
    .catch((err: FirebaseError) => {
      throw err;
    });
};

export let userlogin_google_oauth = () => {
  let provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(async result => {
      console.log('HERE-1');
      if (
        result &&
        result.credential &&
        result.user
      ) {
        console.log('HERE-2');
        let token = (result.credential as firebase.auth.OAuthCredential).accessToken;
        let user = FirebaseUser.create_from_firebase(result.user);
        user.google_access_token = token;
        await user.user().then(user => {
          console.log(user);
          CurrentUser.set_user(user);
        });
        return user;
      } else {
        throw new Error("User not logged in");
      }
    })
    .catch((err: FirebaseError) => {
      throw err;
    });
};
