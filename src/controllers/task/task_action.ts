import { Task } from "../../models/task";
import { Tag } from "../../models";
import CurrentUser from "../user";

export let create_task = async (create_name:string, create_order:number, create_notes:string|null,
    create_deadline:Date|null, create_tag:Tag|null)=> {
    let curr_user = await CurrentUser.get_user();
    let task = new Task ({
        order: create_order,
        name: create_name,
        notes: create_notes,
        deadline: create_deadline,
        times: null,
        tag_list: create_tag,
        Task: null
    });
    
    return await curr_user!.tasks!.create(task);
} 

export let delete_task = async (task_id:string)=> {
    let curr_user = await CurrentUser.get_user();
    return curr_user!.tasks!.delete(task_id);
}