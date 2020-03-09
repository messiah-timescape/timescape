import { Moment} from "moment";
import { Tag } from ".";
import BaseModel from "./base_model";

export class Task extends BaseModel<Task> {
    constructor(init_fields?:Partial<Task>) {
        super();
        Object.assign(this, init_fields);
    }
    order!: number;
    name!: string;
    notes!: string | null;
    deadline!: Date | null; // I think Firestore allows you to use @ServerTimestamp 
    times!: Array<Moment> | null;
    tag_list!: Tag | null;
    Task!: Task | null;
    completed: boolean = false;
}