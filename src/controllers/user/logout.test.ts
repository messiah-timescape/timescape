import userlogout from "./logout";
import { TestLoginActions } from "./login.test";
import firebase from "firebase";
import init_app from "../../init_app";

beforeAll(()=>{
    init_app();
});

it('must log user out', ()=>{
    expect.assertions(1);
    TestLoginActions.email_password();
    return userlogout().then(()=>{
        expect(firebase.auth().currentUser).toBeFalsy();
    });
});