import { Tag } from ".";
import BaseModel from "./base_model";
// import { SubCollection, ISubCollection } from "fireorm";
import moment from "moment";

export class Task extends BaseModel<Task> {
    constructor(init_fields?:Partial<Task>) {
        super();
        Object.assign(this, init_fields);
    }
    order!: number;
    name!: string;
    notes: string = '';
    deadline: Date = moment().add(1, 'day').toDate(); // a day from now
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