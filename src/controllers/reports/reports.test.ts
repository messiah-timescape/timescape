import { Report, ReportTaskInfo, getReport } from "./reports";
import { Period, Tag } from "../../models";
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
        await getReport('daily');
        done();
    });

    // it('let\'s try to run a query and see what we get', async ()=> {
    //     let user = await CurrentUser.get_loggedin();
    //     let report = new Report({time_frame: new Period(moment().subtract(1, 'day'), moment())});
    //     let mapping_promises:Promise<any>[] = [];
    //     user.work_periods
    //         .whereGreaterOrEqualThan('start', report.time_frame.start.toDate())
    //         .find().then( work_periods => {
    //             console.log(`We've filtered the start time and have ${work_periods}`);
    //             for(var prop in work_periods) {
    //                 if (work_periods[prop].end.isAfter(report.time_frame.end)) {
    //                     var index = parseInt(prop);
    //                     work_periods.splice(index, 1);
    //                 }
    //             }

    //             work_periods.forEach(work_period => {
    //                 mapping_promises.push((async () => {
    //                     let task = (await work_period.task!.promise);
    //                     if ( task.tag ) await task.tag.promise;
    //                     report.report_task_collection.push(new ReportTaskInfo({
    //                         completed: task.completed,
    //                         work_period: work_period,
    //                         tag: (task.tag)?task.tag.model:undefined
    //                     }));
    //                 })());
    //             });
    //         });
    
    //     await Promise.all(mapping_promises);
    // });

});