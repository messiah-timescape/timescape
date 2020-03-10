import { Task } from "../../models/task";
import { Tag } from "../../models";
import CurrentUser from "../user";

export let create_task = async (input_task:Partial<Task>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let task = new Task (input_task);
    
    return await curr_user!.tasks!.create(task);
} 

export let delete_task = async (task_id:string)=> {
    let curr_user = await CurrentUser.get_loggedin();
    return curr_user!.tasks!.delete(task_id);
}

export let update_task = async (task_id:string, update_order?:number, update_name?:string,
    update_notes?:string, update_deadline?:Date, update_tag?:Tag)=> {

    let curr_user = await CurrentUser.get_loggedin();
    let task = await curr_user!.tasks!.findById(task_id);
    let field_map:(string)[] = ["order", "name", "notes", "deadline", "tag_list"];
    let fields:(string|number|Date|Tag|undefined)[] = [update_order, update_name, update_notes, update_deadline, update_tag];   
  
    for(let index in fields) {
        if(fields[index] !== undefined) {
            task[field_map[index]] = fields[index];
        }
    }
    return curr_user!.tasks!.update(task)
}

export let complete_task = async (task_id: string) => {
  let curr_user = await CurrentUser.get_user();
  let task = await curr_user!.tasks!.findById(task_id);
  task.completed = true;
  return await curr_user!.tasks!.update(task);
};
