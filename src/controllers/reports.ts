import moment, { Duration, Moment } from "moment";
import { Period } from "../models/task";
import firebase from "firebase";
import { Tag } from "../models";
import { get_settings } from "./user/settings";

// import { Tag } from "../models/tag";

/**************** NOTE TO SELF *************
 * Weekly and Monthly reports need daily aggregations for productivity (focus_percentage and tasks_completed)
 * A lot of functions in pseudo code @ end of file can be reused in other get<Frequency>Report()
 */

/* A data object to hold all the information we want from the tasks for the report */
export class ReportTaskInfo {
    completed!:Boolean;
    work_period!:Period[];
    tag!:"string";

    constructor(init_fields:object) {
        Object.assign(this, init_fields);
        return this;
    }
}

/* A sector of the pie chart in reports */
export class Sector {
    category!: String; // Tag.name | "Break" | "Other" ("Other" is cateogry of Task where Task.tag === undefined)
    duration!: Duration; // is there a way to require fields 'hours' and 'seconds'?
    
    constructor(init_fields:object) {
        Object.assign(this, init_fields);
        return this;
    }
}

/* A report with all aggregated data */
export class Report {
    id: String = ""; // will we be using this? Brainstorm how to index reports...

    time_frame!: Period; // review type; might want to change since different for each report
    total_focus_time!: Duration; // again, is there a way to require these fields
    tasks_completed!:Number;
    focus_percentage!:Number; // 65 will resemble 65%
    chart_sectors!: Sector[];
    report_task_collection!:ReportTaskInfo[];

    constructor(init_fields:object) { // REFACTOR: right now it accepts any object
        Object.assign(this, init_fields);
        return this;
    }

    public getData() {
        // var data:ReportTaskInfo[];
        // var query = firebase.firestore()
        // .collectionGroup('tasks')
        // .where('work_period', '>=', this.time_frame.start) // this query needs work
        // .where('work_period', '<=', this.time_frame.end);
        // query.get().then((snapShot)=> {
            // snapShot.forEach((doc)=> {
            //     let tag = doc.tag;
            //     let completed = doc.completed;
            //     for(key in doc.work_periods) {
            //         if (doc.work_periods[key].isBetween(this.time_frame.start, this.time_frame.end);
            //             data.push(new ReportTaskInfo({
            //                 completed: completed,
            //                 work_period: work_period[key],
            //                 tag: tag
            //             }));
            //     }
            // }
                //// put each doc.tag and doc.work_periods 
                //// together in array of Data objects?
        //     })
        // })
        var work_task = new ReportTaskInfo({
            completed: true,
            work_period: { start: moment().subtract(2, "days").subtract(3, "hours"), end: moment().subtract(2, "days") },
            tag: "Work"
        });
        var school_task = new ReportTaskInfo ({
            completed: true,
            work_period: { start: moment().subtract(3, "days").hour(20).minutes(24), end: moment().subtract(3, "days") },
            tag: "School"
        });
        var chore_task = new ReportTaskInfo({
            completed: false,
            work_period: { start: moment().subtract(1, "day").subtract(4, "hours"), end: moment().subtract(1, "day") },
            tag: "Chore"
        });

        this.report_task_collection = [ work_task, school_task, chore_task];
    }

    public async fill_calculations() {
        var data = this.getData();

        // make declarations for all calculations
        var total_focus_time = 0, 
            completed = 0,
            tag_name = "", 
            focus_time = 0, 
            sector:Sector,
            chart_sector:Sector[] = [];

        for (const key in this.report_task_collection) {
            var obj = this.report_task_collection[key];
            // reset focus_time for new task info
            focus_time = 0;
            // loop through each property of ReportTaskInfo
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop)) {
                    // find "completed" on ReportTaskInfo
                    if (prop == "completed" && obj[prop] == true) {
                        completed++;
                    }
                    // find "work_period" on ReportTaskInfo
                    if(prop == "work_period") {
                        let period = obj[prop];
                        var start, end;
                        // find the "start" and "end" values
                        for (let val in period) {
                            if (val == "start") {
                                start = period[val];
                            } else if (val == "end") {
                                end = period[val];
                            }
                        }
                    }
                    // find tag and save
                    if(prop == "tag") {
                        tag_name = obj[prop];
                    }
                }
            } 
            // subtract start from end to find duration once done looping through properties
            total_focus_time += end - start; // this will not work with current code
            focus_time += end - start; // this also will not work with current code

            sector = new Sector({
                category: tag_name,
                duration: focus_time
            });  
            
            chart_sector.push(sector);
        }
/************* the following is for focus_percentage*/
        // var user_work_start, user_work_stop;
        // // retrieve user settings; I'm not sure how to do this when I 
        // // can't make this calcFocusPercentage() async but also can't
        // // use a .then(()=> {...}) on the get_settings()
        // var settings = await get_settings();
        // user_work_start = settings.work_start_time;
        // user_work_stop = settings.work_stop_time;
           
        // var totalWorkTime = user_work_stop - user_work_start; // won't work for same reasons as fill_calculations() 
        var start_work:any = moment().hour(8).minutes(30), stop_work:any = moment().hour(13).minutes(30);
        var totalWorkTime = stop_work - start_work;

 /*************/
        this.total_focus_time = moment.duration(total_focus_time); // will change once focus_time is properly calculated
        this.tasks_completed = completed;
        this.focus_percentage = Math.round((focus_time / totalWorkTime) * 100);
        this.chart_sectors = chart_sector;

        return this;
    }
}

class Timeline {
    //
}

export class DailyReport extends Report {
    timeline!: Period[]; // Can we make use of Period class, or not since is SubCollection?
    static getDailyReport(page, time_frame) {
        let report = new DailyReport(time_frame).getData();
        // populate timeline
        return report;
    }
    //
}

export class WeeklyReport extends Report {
    graph!: (Duration | Number)[];
    static getWeeklyReport(page, time_frame) {
        //
    }
    //
}

export class MonthlyReport extends Report {
    graph!: (Duration | Number)[];
    static getMonthlyReport(page, time_frame) {
        //
    }
    //
}

// Redirects to the correct get<Frequency>Report function
export function getReport(type:String, page:Number, time_frame:Moment[]){
    switch (type.toLowerCase()) {
        case "daily":
            DailyReport.getDailyReport(page, time_frame);
            break;
        case "weekly":
            WeeklyReport.getWeeklyReport(page, time_frame);
            break;
        case "monthly":
            MonthlyReport.getMonthlyReport(page, time_frame);
            break;
        default:
            let today:Period = new Period();
            today.start = moment().startOf('day');
            today.end = moment();
            DailyReport.getDailyReport(page, today);
            break;        
    }
}


/*************
 * Functions *
 *************/
/* Calculations (from tasks in timeframe):
******************************************
* total_focus_time: for each task, take a work_period and subtract start from end, then add to sum
* tasks_completed: count tasks where tasks.completed = true;
* focus_percentage: (total_focus_time / work_time ) * 100
* chart_sectors: total duration per tag
* timeline: 
* *consider Google events


* total_focus_time, tasks_completed, and chart_sectors all filter through ReportTaskInfo[]
* focus_percentage uses total_focus_time

/*
* when getDailyReport is called...
* // find tasks where tasks.work_periods.start.format("MM DD") === moment.startOf('day').fromNow().format("MM DD")
* && tasks.work_periods.start.format("MM DD") = moment.subtract(7, 'days').format("MM DD")
* and put in ReportTaskInfo: ReportTaskInfo[]
*
****** TASKS COMPLETED **********
*********************************
* var tasks_completed:Number = 0;
* for (task in tasks) {
*   if(task.completed) {
*        tasks_completed++;
*   }
* }
*
******* TOTAL FOCUS TIME AND TOTAL FOCUS TIME PER TAG ******
************************************************************
* var tagSum:Number[] = []; // array of total_focus_time per tag (key->value is tag.name->total_focus_time) 
* var sum:Number = 0;
* for (let task in tasks) {
*   for (let prop of task) {
*       if(typeof(task[prop] === Period)) {            // grab only where task[prop] === work_periods
*           for (let period of prop) {                 // this is O(n^3); is there a more efficient way?
*             let addTime = period.end - period.start; // convert to duration
*             // check tag.name and add to proper index of tagSum
*             sum += addTime;
*           }        
*       }
*   }
* } 
*  total_focus_time = sum;
*  
******* FOCUS PERCENTAGE *********
**********************************
* // retrieve work_start and work_stop from user_settings
* let user_settings = get_settings();
* var focus_percentage, work_dur;
*
* work_start = user_settings.work_start_time;
* work_end = user_settings.work_stop_time;
* 
* work_dur = work_end - work_start; // convert to duration
* focus_percentage = (total_focus_time / work_dur) * 100 // total_focus_time comes from above^^
*
******* CHART SECTORS ************
**********************************
* var chart_sector:Sector[] = [];
* for (focus_time in tagSum) {
*      sector = new Sector({ category: tagSum[focus_time], duration: focus_time});
*      chart_sector.append(sector);
* }
*/