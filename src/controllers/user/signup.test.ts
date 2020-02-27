import init_app from "../../init_app";
import firebase from "firebase";
import { usersignup } from "./signup";
import { FirebaseUser } from "../../models/user";
import CurrentUser from ".";
import * as Chance from "chance";
const chance = new Chance.Chance();
// functions
// 1 - sign the user up
// 2 - persist a partial user?
// make sure the user is FirebaseUser
describe('User Signup with Email and Password', ()=> {
    beforeAll(()=> {
        init_app();
    });

    let new_user: Partial<FirebaseUser>;
    beforeEach(()=> {
         // create a random new user 
        let rand_email = chance.email();
        let rand_pass = chance.string({ length: 7 });
        new_user = {
            email: rand_email,
            password: rand_pass
        };
    });
    
    it('logs in new user', ()=> {
        expect.assertions(1);
       return usersignup(new_user).then(async ()=> {
           // compare logged in user to data of new user
            let current_user = await CurrentUser.get_user();
            if ( current_user ) {
                return expect(current_user.email).toBe(new_user.email);
            }
       }); 
    });
    it('creates the new user in db', ()=> {
        expect.assertions(1);
        return usersignup(new_user).then(async (user_from_db)=> {
            if (user_from_db) {
                return expect(new_user.email).toBe(user_from_db.email);
            }            
        }).catch((err)=>{
            throw err;
        });
    });
    afterAll(()=>{
        firebase.auth().signOut();
    });
});
    
