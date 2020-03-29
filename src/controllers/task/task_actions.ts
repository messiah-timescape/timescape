import { Task } from "../../models/task";
import CurrentUser from "../user";

export let create_task = async (input_task:Partial<Task>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let task = new Task (input_task);
    
    return await curr_user.tasks!.create(task);
} 

export let delete_task = async (task_id:string)=> {
    let curr_user = await CurrentUser.get_loggedin();
    return await curr_user.tasks!.delete(task_id);
}

export let update_task = async (task_id:string, input_task:Partial<Task>)=> {
    let curr_user = await CurrentUser.get_loggedin();
    let task = await curr_user.tasks!.findById(task_id);
    
    for(let index in input_task) {
        if(input_task[index] !== undefined) {
            task![index] = input_task[index];
        }
    }
    return await curr_user.tasks!.update(task!)
}

export let complete_task = async (task_id: string) => {
    let curr_user = await CurrentUser.get_loggedin();
    let task = await curr_user.tasks!.findById(task_id);
    task.completed = true;
    return await curr_user.tasks!.update(task);
};
