import { forgot_password } from "./alter_password";
import init_app from "../../init_app";

beforeAll(async ()=> {
    init_app();
});

it('runs the function', ()=> {
    let email = "lw1298@messiah.edu";
    forgot_password(email);
    console.log("After function call");
})
