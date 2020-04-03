import CurrentUser from "../user"
import { Timer } from "../../models/timer";
import { getRepository } from "fireorm";
import { User, Task } from "../../models";
import { Period } from "../../models/task";
import { complete_task } from "../task/task_actions";
import moment from "moment";

export async function get_controller() {
    return new TimerController((await CurrentUser.get_loggedin()));
}

class TimerController {
    user:User;
    timer:Timer;
    _timer_value?:moment.Duration;

    constructor(user:User) {
        this.user = user;
        this.timer = user.timer;
    }

    async modify_timer( modifier:Function ) {
        let user_repo = getRepository(User);
        // Remove once currentUser is improved upon;
        this.user = (await CurrentUser.get_loggedin());
        modifier();
        this.user.timer = this.timer;
        return user_repo.update(this.user);
    }

    async start() {
        return this.modify_timer( () => {
            if ( this.timer.is_onbreak() ){
                this.timer.current_task!.break_periods.create(new Period().fill_fields({
                    start: this.timer.break_start,
                    end: moment()
                }));
                this.timer.break_start = undefined;
            } else {
                this.timer.timer_start = moment();
            }
        });
    }

    async start_break() {
        return this.modify_timer( () => {
            this.timer.break_start = moment();
        });
    }

    async stop( unset_currenttask:boolean = false) {
        return this.modify_timer( () => {
            this.timer.current_task!.work_periods.create(new Period().fill_fields({
                start: this.timer.timer_start,
                end: ( this.timer.is_onbreak() )?this.timer.break_start:moment()
            }))
            this.timer.timer_start = undefined;
            this.timer.break_start = undefined;
            if (unset_currenttask) {
                this.timer.current_task = undefined;
            }
        });
    }


    async set_current_task(task:Task) {
        return this.modify_timer( () => {
            this.timer.current_task = task;
        });
    }

    async complete_task() {
        let current_task = this.timer.current_task;
        let promises:Promise<any>[] = [
            complete_task( current_task!.id ),
            (this.timer.is_started()) ? this.stop(true) : this.modify_timer(() => {
                this.timer.current_task = undefined;
            })
        ];
        
        return Promise.all(promises);
    }


    start_button_enabled():boolean {
        return this.timer.current_task!==undefined && (
            this.timer.timer_start===undefined || this.timer.break_start!==undefined
        );
    }

    stop_button_enabled():boolean {
        return this.timer.timer_start!==undefined;
    }

    break_button_enabled():boolean {
        return this.timer.current_task!==undefined && (
            this.timer.timer_start!==undefined || this.timer.break_start===undefined
        );
    }

    stop_break_button_enabled():boolean {
        return this.timer.break_start!==undefined;
    }

    get timer_value():moment.Duration{
        if (this._timer_value === undefined) {
            this._timer_value = moment.duration(moment().diff(this.timer.timer_start));
        }
        return this._timer_value;
    }
    
    counter?:NodeJS.Timeout;
    link_state(set_state_fn:Function) { // Links timer to the UI
        set_state_fn(this.timer_value);
        this.counter = setInterval(()=> {
            this.timer_value.add(1000);
            set_state_fn(this.timer_value);
        }, 1000);
    }
    
    unlink_state() {
        if (this.counter) {
            clearInterval(this.counter);
        }
    }
}

