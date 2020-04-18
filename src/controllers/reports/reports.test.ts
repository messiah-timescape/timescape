import { Report } from "./reports";
import { Period } from "../../models";
import moment from "moment";
import init_app from "../../init_app";
import { TestLoginActions } from "../user/login.test";
import firebase from "firebase";

it('runs some functions from report.ts', async done=>{
    let time_frame:Period = new Period();
    time_frame.start = moment().subtract(4, "days");
    time_frame.end = moment();
    var report = new Report({ time_frame: time_frame });
    report = await report.fill_calculations();

    for (let prop in report) {
        if(prop == "report_task_collection") {
            var obj = report[prop];
            for(let val in obj) {
                console.log(`Why is school coming up with negative duration? ${obj[val]}`);  
            }
        }
    }

    console.log(report);
    done();
});

// import { Report, Sector } from "./reports";
// import moment from "moment";
// import firebase, { app } from "firebase";
// import init_app from "../init_app";
// import { TestLoginActions } from "./user/login.test";
// import CurrentUser from "./user";
// import { ReportTaskInfo } from "./reports";
// import { Period } from "../models";

// describe('testing queries', ()=> {
//     beforeAll(async () => {
//         init_app();
//         return await TestLoginActions.email_password();
//     });

//     it('i want to see if this query will work', async ()=> {
//         let data = firebase.firestore().collectionGroup('tasks').where('name', "==", "Changes order from 1 to 2");
//         // console.log(await data.get());
//         // let curr_user = await CurrentUser.get_loggedin();
//         // let task = curr_user.tasks.findOne();
//         // console.log(await task);
//         // var config = {
//         //     apiKey: process.env.REACT_APP_API_KEY,
//         //     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//         //     projectId: process.env.REACT_APP_ID
//         // }
//         // var app = firebase.initializeApp(config);
//         // var db = firebase.firestore(app);
//         // let data = db.collectionGroup('tasks').where('name', "==", "Changes order from 1 to 2");
//         console.log("Do we get past the query?");
//         console.log(`I think this is the query builder: ${data}\n`);
//         data.get().then(function (querySnapshot) {
//             console.log("Is get() activated?");
//             querySnapshot.forEach(function (doc) {
//                 console.log("Is the forEach being used?");
//                 console.log(doc.id, ' => ', doc.data());
//                 // var obj = doc.work_periods;
//                 // for(let key in obj) {

//                 // }
//             });
//         });
//     });

    // it('iterating through an array of objects', done=> {
    //     var period:Period = new Period();
    //         period.start = moment().subtract(2, "days");
    //         period.end = moment();
        
    //     var period1:Period = new Period();
    //         period1.start = moment().subtract(4, "days");
    //         period1.end = moment().subtract(2, "days").hour(8).minutes(24);

    //     var period2:Period = new Period();
    //         period1.start = moment().subtract(4, "days");
    //         period1.end = moment().subtract(2, "days").hour(8).minutes(24);

    //     var period3:Period = new Period();
    //         period1.start = moment().subtract(4, "days");
    //         period1.end = moment().subtract(2, "days").hour(8).minutes(24);
        
    //     var periods = [period2, period3];

    //     var work_task = new ReportTaskInfo({
    //         work_period: period,
    //         tag: "Work"
    //     });
    //     var school_task = new ReportTaskInfo ({
    //         work_period: period1,
    //         tag: "School"
    //     });
    //     var other_task = new ReportTaskInfo ({
    //         work_period: periods,
    //         tag: "other"
    //     })

    //     var data = [ work_task, school_task, other_task ];
    //     console.log("Yoohoo!");
    //     for (const key in data) {
    //         var obj = data[key];
    //         for(var prop in obj) {
    //             if(obj.hasOwnProperty(prop)) {
    //                 console.log(`${prop} = ${obj[prop]}`);
    //                 if(prop == "work_period") {
    //                     let period = obj[prop];
    //                     for (let val in period) {
    //                         console.log(`${val} for "work_period" is ${period[val]}`)
    //                     }
    //                 }
    //             }
    //         }
    //         console.log(obj);
            
    //     }

    //     done();
    // });

//     afterAll(async ()=> {
//         firebase.auth().signOut();
//     })

// });

