import userlogout from "./user.logout";
import { TestLoginActions } from "./user.login.test";
import firebase from "firebase";

it('must log user out', ()=>{
    expect.assertions(1);
    TestLoginActions.email_password();
    return userlogout().then(()=>{
        expect(firebase.auth().currentUser).toBeFalsy();
    });
});