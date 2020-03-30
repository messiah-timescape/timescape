import { forgot_password } from "./alter_password";
import init_app from "../../init_app";

beforeAll(async ()=> {
    init_app();
});

it('runs the function', done => {
    let email = "bshs16leannenw@gmail.com";
    expect.assertions(1);
    let test = ()=>{  
        expect(true).toBeTruthy();
        done();
    }
    return forgot_password(email).then(test);
})
