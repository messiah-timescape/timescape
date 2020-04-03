import { Tag } from "./tag";
import BaseModel from "./base_model";
import moment, { Moment } from "moment";
import { Collection, ISubCollection, SubCollection } from "fireorm";
import { date_field, usermodel_field } from "./field_types";


export class Period extends BaseModel {

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
    // array of start and end times

    @SubCollection(Period)
    work_periods!: ISubCollection<Period>;

    @SubCollection(Period)
    break_periods!: ISubCollection<Period>;

    @usermodel_field
    tag?: Tag;
    
    completed: boolean = false;
}

// export interface PartialTask extends Partial<Task> {
//     deadline:Moment;
//     times:Moment[];
// }