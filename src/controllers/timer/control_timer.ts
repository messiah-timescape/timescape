import CurrentUser from "../user"
import { Timer } from "../../models/timer";
import { getRepository } from "fireorm";
import { User, Task } from "../../models";
import { Period } from "../../models/task";
import { complete_task } from "../task/task_actions";
import moment from "moment";
import { UsermodelDto } from "../../models/field_types";

export async function get_controller(state_setter:Function) {
    let ctrl = new TimerController((await CurrentUser.get_loggedin()), state_setter);
    return ctrl;
}

export class TimerController {
    user:User;
    timer:Timer;
    _timer_value?:moment.Duration;

    constructor(user:User, state_setter:Function) {
        this.user = user;
        this.timer = user.timer;
        this.state_setter = state_setter;
        if ( this.timer.is_started() ) {
            this.state_setter(this.timer_value)
            if ( !this.timer.is_onbreak() ) {
                this.start_counter();
            }
        }
    }

    async modify_timer( modifier:Function ) {
        let user_repo = getRepository(User);
        // Remove once currentUser is improved upon;
        this.user = (await CurrentUser.get_loggedin());
        this.timer = this.user.timer;
        if (this.timer.current_task)
            await this.timer.current_task.promise;
        await modifier();
        this.user.timer = this.timer;
        return user_repo.update(this.user);
    }

    async start() {
        return this.modify_timer( async () => {
            if ( this.timer.is_onbreak() ){
                let current_task = (await this.timer.current_task!.promise);
                if (!current_task) {
                    throw new Error("Current task not set");
                }
                this.user.break_periods.create(new Period(
                    this.timer.break_start,moment(),
                    current_task
                ));
                this.timer.break_start = undefined;
                console.log("Break over!");
            } else {
                this.timer.timer_start = moment();
                console.log("Let's gooo!", this.timer.timer_start);
            }
        }).then( passthrough => {
            this.start_counter();
            return passthrough;
        });
    }

    async start_break() {
        return this.modify_timer( () => {
            this.timer.break_start = moment();
            console.log("Break time!");
        }).then( passthrough => {
            this.pause_counter();
            return passthrough;
        });
    }

    async stop( unset_currenttask:boolean = false) {
        if ( !this.timer.current_task ) {
            throw new Error("Current task necessary");
        }
        return this.modify_timer( async () => {
            this.user.work_periods.create(new Period(
                this.timer.timer_start, ( this.timer.is_onbreak() )?this.timer.break_start:moment(),
                this.timer.current_task!.promise
            ));
            this.timer.timer_start = undefined;
            this.timer.break_start = undefined;
            if (unset_currenttask) {
                this.timer.current_task = undefined;
            }
        }).then(passthrough => {
            this.stop_counter();
            return passthrough;
        });
    }


    async set_current_task(task:Task) {
        return await this.modify_timer( async () => {
            this.timer.current_task = new UsermodelDto<Task>(task);
            console.log("So this is what you've been working on!");
        });
    }

    async complete_task() {
        let current_task = (await this.timer.current_task!).model;
        if (!current_task){
            throw new Error("No current task has been set");
        }
        let promises:Promise<any>[] = [
            complete_task( current_task.id ),
            (this.timer.is_started()) ? this.stop(true) : this.modify_timer(() => {
                this.timer.current_task = undefined;
            })
        ];
        
        return Promise.all(promises);
    }


    start_button_enabled():boolean {
        return !!(this.timer.current_task && (
            !this.timer.timer_start || this.timer.break_start
        ));
    }

    stop_button_enabled():boolean {
        return !!this.timer.timer_start;
    }

    break_button_enabled():boolean {
        return !!(this.timer.current_task && (
            this.timer.timer_start || !this.timer.break_start
        ));
    }

    stop_break_button_enabled():boolean {
        return !!this.timer.break_start;
    }
    
    state_setter:Function;
    counter?:NodeJS.Timeout;

    get timer_value():moment.Duration{
        if (!this._timer_value) {
            this._timer_value = moment.duration(moment().diff(this.timer.timer_start));
        }
        return this._timer_value;
    }

    reset_counter(){
        this._timer_value = moment.duration(0);
        this.counter = undefined;
    }

    start_counter() {
        if ( !this.counter ) {
            this.state_setter(this.timer_value);
            this.counter = setInterval(()=> {
                this.timer_value.add(1000);
                this.state_setter(this.timer_value);
            }, 1000);
        }
    }

    pause_counter() {
        if (this.counter) {
            clearInterval(this.counter);
            this.counter = undefined;
        }
    }

    stop_counter() {
        this.pause_counter();
        this.reset_counter();
        this.state_setter(this.timer_value);
    }
}

