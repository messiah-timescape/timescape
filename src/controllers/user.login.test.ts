import init_app from "../init_app"
import { userlogin_email_password } from "./user.login";
import firebase from "firebase";


    
const auth_user = {
    email: process.env.REACT_APP_FIREBASE_TEST_AUTH_EMAIL,
    password: process.env.REACT_APP_FIREBASE_TEST_AUTH_PWD
}

export class TestLoginActions {
    
    static email_password() {
        return userlogin_email_password(auth_user.email!, auth_user.password!)
    }
}


describe('User Login with Email and Password', ()=>{
    beforeAll(()=>{
        init_app();
    })

    it('must login user when email and password are right', ()=>{
        expect.assertions(1);
        return TestLoginActions.email_password().then((user:any)=>{
            return expect(user.email).toBe(auth_user.email);
        });
    });

    afterEach(()=>{
        firebase.auth().signOut();
    });
})