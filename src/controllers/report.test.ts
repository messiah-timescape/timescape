import { Report, Sector } from "./reports";
import moment from "moment";

it('i just want a report', ()=> {
    var sector = new Sector({
        category: "code",
        duration: moment.duration(4, "hours")
    });
    var sector_2 = new Sector({
        category: "chores",
        duration: moment.duration(1, "hour")
    })
    var report = new Report({
        time_frame: moment(),
        total_focus_time: moment.duration(5, "hours"),
        tasks_completed: 5,
        focus_percentage: 65,
        chart_sectors: [sector, sector_2]
    });
    console.log(report);
});