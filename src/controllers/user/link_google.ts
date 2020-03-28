import CurrentUser from ".";
import firebase from "firebase";

export async function userlink_google() {
    let provider = new firebase.auth.GoogleAuthProvider();
    return (await CurrentUser.get_loggedin()).firebase_user!.linkWithPopup(provider);
}