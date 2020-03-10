import init_app from "../../init_app";
import { TestLoginActions } from "../user/login.test";
import firebase from "firebase";
import { update_task, delete_task } from "./task_action";
import CurrentUser from "../user";

describe('Update Task', ()=>{
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    
    // Retrieves task from current user with given id
    let curr_task = async (id:string)=> {
        let curr_user = await CurrentUser.get_user();
        return await curr_user!.tasks!.findById(id);
    }

    // Id of task we want to update in these tests
    let task_id = "yDhmq7jgnaFA9eogwekG"

    /************************************
     * Test Start
    ************************************/
    it('updates order', async ()=>{
        await update_task(task_id, 2);
        let task = await curr_task(task_id);
        return expect(task.order).toBe(2);
    });

    it('updates name', async ()=>{
        let update_name:string = "Name Updated"
        await update_task(task_id, undefined, update_name);
        let task = await curr_task(task_id);
        return expect(task.name).toBe(update_name);
    });

    it('updates notes (the description)', async ()=> {
        let update_notes:string = "This task was updated by create_delete_task.test.ts";
        await update_task(task_id, undefined, undefined, update_notes);
        let task = await curr_task(task_id);
        return expect(task.notes).toBe(update_notes);
    });

    afterAll(async ()=> {
        firebase.auth().signOut();
    })
});