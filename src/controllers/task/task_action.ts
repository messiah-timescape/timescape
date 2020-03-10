import { Task } from "../../models/task";
import { Tag } from "../../models";
import CurrentUser from "../user";

export let create_task = async (create_name:string, create_order:number, create_notes:string,
    create_deadline:Date, create_tag:Tag)=> {
    let curr_user = await CurrentUser.get_user();
    let task = new Task ({
        order: create_order,
        name: create_name,
        notes: (create_notes)?create_notes:"",
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

export let update_task = async (task_id:string)=> {
    // use '?' with optional parameters
    // get fields that need to be updated
    // save fields in array
    // loop through array
    // if (value != undefined) 
    // append to update statment

    //curr_user!.tasks!.update( <update statement> );
    /* syntax of update statement:
    .update({
        "key": value,
        "key1": value1
    })
    */
}

export let complete_task = async (task_id:string)=> {
    let curr_user = await CurrentUser.get_user();
    let task = await curr_user!.tasks!.findById(task_id);
    task.completed = true;
    return await curr_user!.tasks!.update(task);
}
