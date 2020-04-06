import moment, { Moment } from "moment";
import { Exclude, Expose } from "class-transformer";
import { Task } from ".";
import { usermodel_field, date_field, UsermodelDto } from "./field_types";
import BaseModel from "./base_model";
import { Collection } from "fireorm";

@Exclude()
@Collection('timer')
export class Timer extends BaseModel {
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
    @date_field
    timer_start?:Moment;
    @Expose()
    @date_field
    break_start?:Moment;
    
    @Expose()
    @usermodel_field('tasks')
    current_task?:UsermodelDto<Task>;
    
    is_started() {
        return !!this.timer_start;
    }

    is_onbreak() {
        return !!this.break_start;
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