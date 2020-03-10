import { Tag } from ".";
import BaseModel from "./base_model";

export class Task extends BaseModel<Task> {
    constructor(init_fields?:Partial<Task>) {
        super();
        Object.assign(this, init_fields);
    }
    order!: number;
    name!: string;
    notes?: string;
    deadline!: Date; // I think Firestore allows you to use @ServerTimestamp 
    times?: Date[];
    tag_list?: Tag;
    Task!: Task;
    completed: boolean = false;
}