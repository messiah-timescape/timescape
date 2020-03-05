import { Moment} from "moment";
import { Tag } from ".";
import BaseModel from "./base_model";

export class Task extends BaseModel<Task> {
    order!: number;
    name!: string;
    notes!: string | null;
    deadline!: Date; // I think Firestore allows you to use @ServerTimestamp 
    times!: Array<Moment> | null;
    tag_list!: Tag | null;
    Task!: Task | null;
    completed: boolean = true;
}