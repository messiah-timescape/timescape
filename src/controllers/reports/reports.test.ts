import { Report, create_time_frame } from "./reports";
import { Period } from "../../models";
import moment from "moment";
import init_app from "../../init_app";
import { TestLoginActions } from "../user/login.test";
import firebase from "firebase";
import CurrentUser from "../user";

describe ("Report tests", ()=>{
    beforeAll( async done => {
        await init_app();
        let d = await TestLoginActions.email_password();
        done();
        return d;
    });


    it('runs some functions from report.ts', async done=>{
        let time_frame = new Period(moment().subtract(4, "days"), moment());
        
        var report = new Report({ time_frame: time_frame });
        report = await report.fill_calculations();

        console.log(report);
        done();
    });

});