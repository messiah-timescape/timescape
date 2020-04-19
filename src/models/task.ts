import { Tag } from "./tag";
import BaseModel from "./base_model";
import moment, { Moment } from "moment";
import { Collection } from "fireorm";
import { date_field, usermodel_field, UsermodelDto } from "./field_types";


@Collection('period')
export class Period extends BaseModel {
    constructor(start?:Moment, end?:Moment, task?:Promise<Task> | Task){
        super();
        if (start)
            this.start = start;
        if (end)
            this.end = end;
        if (task)
            this.task = new UsermodelDto<Task>(task);
    }
    @usermodel_field('tasks')
    task?: UsermodelDto<Task>;

    @date_field
    start!: Moment;

    @date_field
    end!: Moment;
}

@Collection('task')
export class Task extends BaseModel {
    constructor(init_fields?:Partial<Task>) {
        super();
        Object.assign(this, init_fields);
    }
    order!: number;
    name!: string;
    notes: string = '';

    @date_field
    deadline: Moment = moment().add(1, 'day'); // a day from now

    @usermodel_field('tags')
    tag?: UsermodelDto<Tag>;
    
    completed: boolean = false;
}

// export interface PartialTask extends Partial<Task> {
//     deadline:Moment;
//     times:Moment[];
// }