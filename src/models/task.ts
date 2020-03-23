import { Tag } from ".";
import BaseModel from "./base_model";
// import { SubCollection, ISubCollection } from "fireorm";
import moment, { Moment } from "moment";
import { Collection } from "fireorm";


@Collection('task')
export class Task extends BaseModel {
    constructor(init_fields?:Partial<Task>) {
        super();
        Object.assign(this, init_fields);
    }
    order!: number;
    name!: string;
    notes: string = '';
    deadline: Moment = moment().add(1, 'day'); // a day from now
    // array of start and end times
    times: Date[] = [];
    tag_list: Tag[] = [];
    // @SubCollection(Task)
    // subtasks: ISubCollection<Task>;
    // tasks!:Task;
    completed: boolean = false;
}

// export interface PartialTask extends Partial<Task> {
//     deadline:Moment;
//     times:Moment[];
// }