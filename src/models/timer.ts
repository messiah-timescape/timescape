import moment, { Moment } from "moment";
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
    break_start?:Moment;
    
    @Expose()
    @usermodel_field
    current_task?:Task;
    
    is_started() {
        return this.timer_start !== undefined;
    }

    is_onbreak() {
        return this.break_start !== undefined;
    }
    
    start() {
        if ( !this.current_task ) {
            throw new Error("Must have current task");
        }
        this.timer_start = moment();
    }

    pause() {
        if ( !this.timer_start ) {
            throw new Error("Must have started timer");
        }
        this.break_start = moment();
    }

    // this will make a "stop time" but also push to database
    stop() {
        
    }

    reset() {
        // clears the timer and starts again from 0
    }

    save_time() {
        
    }

    isReset() {
        // returns bool for whether or not the timer has been reset
    }
    
}