import moment, { Duration, Moment } from "moment";
import { Period } from "../models/task";
// import firebase from "firebase";
// import { get_settings } from "./user/settings";

/**************** NOTE TO SELF *************
 * Weekly and Monthly reports need daily aggregations for productivity (focus_percentage and tasks_completed)
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

/* A section of the pie chart in reports as well as a section in the graph for weekly/monthly reports */
export class ChartSection {
    category!: String; // Tag.name | "Break" | "Other" ("Other" is cateogry of Task where Task.tag === undefined)
    duration!: Duration; // is there a way to require fields 'hours' and 'seconds'?
    
    constructor(init_fields:object) {
        Object.assign(this, init_fields);
        return this;
    }
}

/* A section for the timeline in daily report */
export class TimelineSection {
    category!: String; // Tag.name | "Break" | "Other"
    section!: Period; // beginning and end of a section
}

/* A report with all aggregated data */
export class Report {
    time_frame!: Period;
    total_focus_time!: Duration;
    tasks_completed!:Number;
    focus_percentage!:Number; // 65 will resemble 65%
    chart_sectors!: ChartSection[];
    report_task_collection!:ReportTaskInfo[];

    constructor(init_fields:object) { // REFACTOR: right now it accepts any object
        Object.assign(this, init_fields);
        return this;
    }

    // Creates ReportTaskInfo and populates this.report_task_collection
    public getReportData() {
        // var data:ReportTaskInfo[];
        // var query = firebase.firestore()
        // .collectionGroup('tasks')
        // .where('work_period', '>=', this.time_frame.start) // this query needs work (I wish we could use <Moment>.isBetween(<Moment>, <Moment>))
        // .where('work_period', '<=', this.time_frame.end);  // we want to get all tasks from current month so that all reports (daily, weekly, and monthly) can make use of this.report_task_collection
        // query.get().then((snapShot)=> {                    // would need to make sure that if getMonthReport() is being used for other months, we call this query again
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

    // populates all properties that hold aggregated data
    public async fill_calculations() {
        if(this.report_task_collection === undefined) { // Will we use fill_calculations after getReportData? (If so, we need this if statement)
            this.getReportData();
        }
         
        // make declarations for all calculations
        var total_focus_time = 0, 
            completed = 0,
            tag_name = "", 
            focus_time = 0, 
            sector:ChartSection,
            chart_sector:ChartSection[] = [];

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
            total_focus_time += end - start; 
            focus_time += end - start; 

            sector = new ChartSection({
                category: tag_name,
                duration: focus_time
            });  
            
            chart_sector.push(sector);
        }
/************* the following is for focus_percentage; requires retrieving user_settings from current user*/
        // var user_work_start, user_work_stop;
        // // retrieve user settings; I'm not sure how to do this when I 
        // // can't make this calcFocusPercentage() async but also can't
        // // use a .then(()=> {...}) on the get_settings()
        // var settings = await get_settings();
        // user_work_start:any = settings.work_start_time;
        // user_work_stop:any = settings.work_stop_time;
           
        // var totalWorkTime = user_work_stop - user_work_start; 
/****************************************************************************** 4
        Add in considerations of Google events (subtract even duration from totalWorkTime)
 ******************************************************************************/
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

export class DailyReport extends Report {
    timeline!: TimelineSection[];
    private static populate_timeline() {
        // loop through this.report_task_collection
        // add things to this.timeline
        // include Google events
    }

    // I think we'll need to return 7 reports for the page instead of just the first one
    public static getDailyReport(page) {
        // var time_frame is this day (the default)
        var time_frame:Period = create_time_frame(moment().startOf('day'), moment());
        time_frame.start = moment();
        time_frame.end = moment().startOf('day');

        let report = new DailyReport(time_frame).fill_calculations();
        this.populate_timeline();
        return report;
    }

    
}

export class WeeklyReport extends Report {
    graph!: ChartSection[];

    private static populate_graph() {
        // loop through this.report_task_collection
        // add things to this.graph
    }

    // I think we'll need to return 7 reports for the page instead of just the first one
    public static getWeeklyReport(page) {
        // var time_frame is this week (the default)
        var time_frame:Period = create_time_frame(moment().startOf('week'), moment());

        let report = new WeeklyReport(time_frame).fill_calculations();
        this.populate_graph();
        return report;
    }
}

export class MonthlyReport extends Report {
    graph!: ChartSection[];

    private static populate_graph() {
        // loop through this.report_task_collection
        // add things to this.graph
    }

    // I think we'll need to return 7 reports for the page instead of just the first one
    public static getMonthlyReport(page) {
        // var time_frame is this month (the defualt)
        var time_frame:Period = create_time_frame(moment().startOf('month'), moment());

        let report = new MonthlyReport(time_frame).fill_calculations();
        this.populate_graph();
        return report;
    }
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

function create_time_frame(start:Moment, end:Moment) {
    let time_frame:Period = new Period();
    time_frame.start = start;
    time_frame.end = end;

    return time_frame;
}


/*****************************************
* Calculations (from tasks in timeframe):
******************************************
* total_focus_time: for each task, take a work_period and subtract start from end, then add to sum
* tasks_completed: count tasks where tasks.completed = true;
* focus_percentage: (total_focus_time / work_time ) * 100
* chart_sectors: total duration per tag
* timeline: 
* *consider Google events


* total_focus_time, tasks_completed, and chart_sectors all filter through ReportTaskInfo[]
* focus_percentage uses total_focus_time

* when getDailyReport is called...
* Default:
* find tasks .where(work_periods.start.format("MM DD YYYY"), ">=", moment.startOf('day').fromNow().format("MM DD YYYY"))
*            .where(work_periods.end.format("MM DD YYYY"), "<=", moment.subtract(7, 'days').format("MM DD YYYY"))
* and put in ReportTaskInfo: ReportTaskInfo[]
*
* Ow:
* find tasks .where(work_periods.start.format("MM DD YYYY"), ">=", this.time_frame.start.format("MM DD"))
*            .where(work_periods.end.format("MM DD"), "<=", this.time_frame.end.format("MM DD"))
* and put in ReportTaskInfo: ReportTaskInfo[]

* when getWeekyReport is called...
* // find tasks .where(work_periods.start.format("MM DD YYYY"), ">=", this.time_frame.start.format("MM DD YYYY"))
*               .where(work_periods.end.format("MM DD YYYY"), "<=", this.time_frame.end.format("MM DD YYYY"))
* and put in ReportTaskInfo: ReportTaskInfo[]

* when getMonthlyReport is called...
* // find tasks .where(work_periods.start.format("MM DD YYYY"), ">=", this.time_frame.start.format("MM DD YYYY"))
*               .where(work_periods.end.format("MM DD YYYY"), "<=", this.time_frame.end.format("MM DD YYYY"))
* and put in ReportTaskInfo: ReportTaskInfo[]

*/
