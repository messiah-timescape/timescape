import {firestore} from "firebase";

import { Tag } from "./tag";
import BaseModel from "./base_model";
import moment, { Moment } from "moment";
import { Collection, ISubCollection, SubCollection, Type } from "fireorm";
import { date_field, usermodel_field } from "./field_types";
import { Transform } from "class-transformer";
import CurrentUser from "../controllers/user";


export class WorkPeriod extends BaseModel {

    @date_field
    start_datetime!: Moment;

    @date_field
    end_datetime!: Moment;
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
    
    @SubCollection(WorkPeriod)
    work_periods!: ISubCollection<WorkPeriod>;

    @usermodel_field
    tag?: Tag;
    
    completed: boolean = false;
}

// export interface PartialTask extends Partial<Task> {
//     deadline:Moment;
//     times:Moment[];
// }