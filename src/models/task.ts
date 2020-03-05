import moment, { Moment, now } from "moment";
import { Tag } from ".";
import BaseModel from "./base_model";
import { Collection } from "fireorm";

export class Task extends BaseModel<Task> {
    order: number = 1;
    name: string = "Complete Test";
    notes: string | null = "I'm trying to test my Task class as a SubCollection of User";
    deadline: Date = moment().toDate(); // I think Firestore allows you to use @ServerTimestamp 
    times: Array<Moment> | null = null;
    tag_list: Tag | null = null;
    Task: Task | null = null;
    completed: boolean = true;
}

