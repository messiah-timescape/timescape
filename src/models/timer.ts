import moment, { Moment } from "moment";
import CurrentUser from "../controllers/user";
import { Exclude, Expose } from "class-transformer";
import { Task } from ".";
import { usermodel_field } from "./field_types";

@Exclude()
export class Timer {
    // seconds 
    // minutes
    // hours

    /* for conversion
    // seconds_in_minute
    // minutes_in_hour
    */

    /* for placement
    // seconds = 1
    // minutes = 2
    // hours = 3
    */

    // counter?

    @Expose()
    timer_start?:Moment;
    
    @Expose()
    @usermodel_field
    current_task?:Task;

    
    start() {
        // create a timestamp
    }

    // this will make a "stop time"
    pause() {
        // creates a timestamp
    }

    // this will make a "stop time" but also push to database
    stop() {
        // create a timestamp
    }

    reset() {
        // clears the timer and starts again from 0
    }

    saveTime() {
        // saves timed interval to db as WorkPeriod
    }

    isReset() {
        // returns bool for whether or not the timer has been reset
    }

    link_state(set_state_fn:Function, current_state?:moment.Duration) { // Links timer to the UI
        // if 
    }
    
}