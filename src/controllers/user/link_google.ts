import CurrentUser from ".";
import firebase from "firebase";
import { getRepository } from "fireorm";
import { User } from "../../models";

export async function user_hasgoogle() {
    return (await CurrentUser.get_loggedin()).has_google();
}

export async function userlink_google() {
    let provider = new firebase.auth.GoogleAuthProvider();
    let user = await CurrentUser.get_loggedin();
    return user.firebase_user!.linkWithPopup(provider);
}