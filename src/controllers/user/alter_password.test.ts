import { forgot_password } from "./alter_password";
import init_app from "../../init_app";

beforeAll(async ()=> {
    init_app();
});

it('runs the function', done => {
    let email = "lw1298@messiah.edu";
    expect.assertions(1);
    let test = ()=>{
        console.log("hey");  
        expect(true).toBeTruthy();
        done();
    }
    return forgot_password(email).then(test);
    console.log("After function call");
})
