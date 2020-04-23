import moment, { Duration } from "moment";
import { Period } from "../../models/task";
// import {get_events} from "../user/get_events";
import CurrentUser from "../user";
import { Tag } from "../../models";

/**************** NOTE TO SELF *************
 * Weekly and Monthly reports need daily aggregations for productivity (focus_percentage and tasks_completed)
 */

/* A data object to hold all the information we want from the tasks for the report */
export class ReportTaskInfo {
    completed!:Boolean;
    work_period!:Period;
    tag!:Tag;

    constructor(init_fields:Partial<ReportTaskInfo>) {
        Object.assign(this, init_fields);
        return this;
    }
}

/* A section of the pie chart in reports as well as a section in the graph for weekly/monthly reports */
export class ChartSection {
    category!: Tag; // Tag.name | "Break" | "Other" ("Other" is cateogry of Task where Task.tag === undefined)
    duration!: Duration; // is there a way to require fields 'hours' and 'seconds'?
    
    constructor(init_fields:object) {
        Object.assign(this, init_fields);
        return this;
    }
}

/* A section for the timeline in daily report */
export class TimelineSection {
    category!: Tag; 
    section!: Period; // beginning and end of a section
}

/* A report with all aggregated data */
export class Report {
    time_frame!: Period;
    total_focus_time!: Duration;
    tasks_completed!:Number;
    focus_percentage!:Number; // 65 will resemble 65%
    chart_sectors!: ChartSection[];
    report_task_collection:ReportTaskInfo[] = [];

    constructor(init_fields:object) { // REFACTOR: right now it accepts any object
        Object.assign(this, init_fields);
        return this;
    }

    // Creates ReportTaskInfo and populates this.report_task_collection
    public async getReportData() {
        // let user = await CurrentUser.get_loggedin();
        // let mapping_promises:Promise<any>[] = [];
        // user.work_periods
        //     .whereGreaterOrEqualThan('start', this.time_frame.start.toDate())
        //     .find().then( work_periods => {
        //         console.log(`We've filtered the start time and have ${work_periods}`);
        //         for(var prop in work_periods) {
        //             if (work_periods[prop].end.isAfter(this.time_frame.end)) {
        //                 console.log(`Now we're making sure that the ${work_periods[prop].end} is after ${this.time_frame.end} to remove it.`);
        //                 var index = parseInt(prop);
        //                 work_periods.splice(index, 1);
        //             }
        //         }

        //         work_periods.forEach(work_period => {
        //             mapping_promises.push((async () => {
        //                 let task = (await work_period.task!.promise);
        //                 if ( task.tag ) await task.tag.promise;
        //                 this.report_task_collection.push(new ReportTaskInfo({
        //                     completed: task.completed,
        //                     work_period: work_period,
        //                     tag: (task.tag)?task.tag.model:undefined
        //                 }));
        //             })());
        //         });
        //     });

        // // mapping_promises.push(get_events(this.time_frame.start, this.time_frame.end).then( events => {
        // //     if (events) {
        // //         this.report_task_collection = this.report_task_collection.concat(events);
        // //     }
        // // }));
    
        // await Promise.all(mapping_promises);
        
          var work_task = new ReportTaskInfo({
            completed: true,
            work_period: new Period(moment().subtract(5, "hours"), moment().subtract(3, "hours")),
            tag: new Tag({name : "work", color: "blue"})
        });
        var school_task = new ReportTaskInfo ({
            completed: true,
            work_period: new Period(moment().subtract(3, "hours"), moment().subtract(2, "hours")),
            tag: new Tag({ name: "School", color: "purple"})
        });
        var chore_task = new ReportTaskInfo({
            completed: false,
            work_period: new Period(moment().subtract(7, "hours"), moment().subtract(1, "hour")),
            tag: new Tag({ name: "Chore", color: "green"})
        });

        this.report_task_collection = [ work_task, school_task, chore_task];
    }

    // populates all properties that hold aggregated data
    public async fill_calculations() {
        await this.getReportData();
         
        // make declarations for all calculations
        var total_focus_time = 0, 
            completed = 0,
            tag:Tag = new Tag(), 
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
                    if (prop === "completed" && obj[prop] === true) {
                        //console.log(`We've found ${obj[prop]} is the value for ${prop}`);
                        completed++;
                    }
                    // find "work_period" on ReportTaskInfo
                    if(prop === "work_period") {
                        //console.log(`We've moved on to ${prop}`);
                        let period = obj[prop];
                        var start, end;
                        // find the "start" and "end" values
                        for (let val in period) {
                            if (val === "start") {
                                //console.log(`The ${val} for ${period.to_json()} is ${period[val]}`);
                                start = period[val];
                            } else if (val === "end") {
                                //console.log(`The ${val} for ${period.to_json()} is ${period[val]}`);
                                end = period[val];
                            }
                        }
                    }
                    // find tag and save
                    if(prop === "tag") {
                        //console.log(`The ${prop} is ${obj[prop].to_json()} `);
                        tag = obj[prop];
                    }
                }
            } 
            // subtract start from end to find duration once done looping through properties
            total_focus_time += end - start; 
            //console.log(`We've caluclated ${total_focus_time} for the total focus time`);
            focus_time += end - start; 
            //console.log(`We've caluclated ${focus_time} for the focus time from the report task info`);
            sector = new ChartSection({
                category: tag,
                duration: focus_time
            });  
            
            chart_sector.push(sector);
            //console.log("We've pushed to the chart_sector and will move on to the next report task info.");
        }
/************* the following is for focus_percentage; requires retrieving user_settings from current user*/
        var user_work_start, user_work_stop;
        // retrieve user settings; I'm not sure how to do this when I 
        // can't make this calcFocusPercentage() async but also can't
        // use a .then(()=> {...}) on the get_settings()
        let user = await CurrentUser.get_loggedin();
        var settings = await user.settings;
        user_work_start = settings.work_start_time;
        user_work_stop = settings.work_stop_time;
        var totalWorkTime = user_work_stop - user_work_start; 
/****************************************************************************** 
        Add in considerations of Google events (subtract even duration from totalWorkTime)
 ******************************************************************************/
        //var start_work:any = moment().hour(8).minutes(30), stop_work:any = moment().hour(13).minutes(30);
        var totalWorkTime = user_work_stop - user_work_start;

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
    private populate_timeline() {
        // loop through this.report_task_collection
        // add things to this.timeline
        // include Google events
    }

    // I think we'll need to return 7 reports for the page instead of just the first one
    public getDailyReport() {
        this.fill_calculations();
        this.populate_timeline();
        return this;
    }

    
}

export class WeeklyReport extends Report {
    graph!: ChartSection[];

    private static populate_graph() {
        // loop through this.report_task_collection
        // add things to this.graph
    }

    // I think we'll need to return 7 reports for the page instead of just the first one
    public static getWeeklyReport() {
        // var time_frame is this week (the default)
        var time_frame:Period = new Period(moment().startOf('week'), moment());

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
    public static getMonthlyReport() {
        // var time_frame is this month (the defualt)
        var time_frame:Period = new Period(moment().startOf('month'), moment());

        let report = new MonthlyReport(time_frame).fill_calculations();
        this.populate_graph();
        return report;
    }
}

// Redirects to the correct get<Frequency>Report function
export function getReport(type:String){
    switch (type.toLowerCase()) {
        case "daily":
            // var time_frame is this day (the default)
            console.log("You called me!");
            var time_frame:Period = new Period(moment().startOf('day'), moment());
            let report = new DailyReport({time_frame: time_frame});
            console.log(report.fill_calculations());
            return report.fill_calculations();
        case "weekly":
            WeeklyReport.getWeeklyReport();
            break;
        case "monthly":
            MonthlyReport.getMonthlyReport();
            break;
        default:
            //
            break;        
    }
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
