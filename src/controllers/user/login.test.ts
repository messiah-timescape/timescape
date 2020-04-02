import init_app from "../../init_app"
import { userlogin_email_password,userlogin_google_oauth } from "./login";
import firebase from "firebase";
import CurrentUser from ".";


    
const auth_user = {
    email: process.env.REACT_APP_FIREBASE_TEST_AUTH_EMAIL,
    password: process.env.REACT_APP_FIREBASE_TEST_AUTH_PWD
}

export class TestLoginActions {
    
    static email_password() {
        return userlogin_email_password(auth_user.email!, auth_user.password!)
    }

    static google_oauth() {
        return userlogin_google_oauth();
    }
}
let test_run = false;
describe('User Login with Email and Password', ()=>{
    beforeAll(()=>{
        init_app();
    })

    it('must login user when email and password are right', done =>{

        if ( !test_run ) {
            test_run = true;
            expect.assertions(2);
            return TestLoginActions.email_password().then(async (user:any)=>{
                let current_user = await CurrentUser.get_user();
                if(current_user){
                    expect(current_user.email).toBe(auth_user.email);
                }
                expect(user.email).toBe(auth_user.email);
                done();
            });
        } else {
            done();
        }
    });

    // it('must login user when oauth creds are right', ()=>{
    //     expect.assertions(1);
    //     return TestLoginActions.google_oauth().then((user:any)=>{
    //         return expect(user.email).toBeTruthy();
    //     })
    // });

    afterEach(()=>{
        firebase.auth().signOut();
    });
})