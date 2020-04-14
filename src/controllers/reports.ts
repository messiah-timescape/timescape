import moment, { Duration, Moment } from "moment";
import { Period } from "../models/task";
// import { Tag } from "../models/tag";

/**************** NOTE TO SELF *************
 * Weekly and Monthly reports need daily aggregations for productivity (focus_percentage and tasks_completed)
 * A lot of functions in pseudo code @ end of file can be reused in other get<Frequency>Report()
 */

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

    time_frame!: Moment | Moment[]; // review type; might want to change since different for each report
    total_focus_time!: Duration; // again, is there a way to require these fields
    tasks_completed!:Number;
    focus_percentage!:Number; // 65 will resemble 65%
    chart_sectors!: Sector[];

    constructor(init_fields:object) { // REFACTOR: right now it accepts any object
        Object.assign(this, init_fields);
        return this;
    }
}

class Timeline {
    //
}

export class DailyReport extends Report {
    timeline!: Period[]; // Can we make use of Period class, or not since is SubCollection?
    static getDailyReport(page) {
        //
    }
    //
}

export class WeeklyReport extends Report {
    graph!: (Duration | Number)[];
    static getWeeklyReport(page) {
        //
    }
    //
}

export class MonthlyReport extends Report {
    graph!: (Duration | Number)[];
    static getMonthlyReport(page) {
        //
    }
    //
}

// Redirects to the correct get<Frequency>Report function
export function getReport(type:String, page:Number){
    switch (type.toLowerCase()) {
        case "daily":
            DailyReport.getDailyReport(page);
            break;
        case "weekly":
            WeeklyReport.getWeeklyReport(page);
            break;
        case "monthly":
            MonthlyReport.getMonthlyReport(page);
            break;
        default:
            DailyReport.getDailyReport(page);
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
* focus percentage: (total_focus_time / work_time ) * 100
* chart_sectors: total duration per tag
* timeline: 
* *consider Google events

/*
* when getDailyReport is called...
* // find tasks where tasks.work_periods.start.format("MM DD") === moment.startOf('day').fromNow().format("MM DD")
* && tasks.work_periods.start.format("MM DD") = moment.subtract(7, 'days').format("MM DD")
* and put in tasks: Task[]
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