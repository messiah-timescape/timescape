// import { Report } from "./reports";
// import { Period } from "../../models";
// import moment from "moment";
// import init_app from "../../init_app";
// import { TestLoginActions } from "../user/login.test";
// import firebase from "firebase";

// describe ("Report tests", ()=>{
//     beforeAll( async done => {
//         await init_app();
//         let d = await TestLoginActions.email_password();
//         done();
//         return d;
//     });


//     it('runs some functions from report.ts', async done=>{
//         let time_frame = new Period(moment().startOf('day'), moment().add(1, "minute"));
        
//         var report = new Report({ time_frame: time_frame });
//         report = await report.fill_calculations();

//         console.log(report);
//         done();
//     });

//     afterAll(() => {
//         firebase.auth().signOut();
//     });
// });