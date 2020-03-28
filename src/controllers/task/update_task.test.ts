import init_app from "../../init_app";
import { TestLoginActions } from "../user/login.test";
import firebase from "firebase";
import { update_task, create_task} from "./task_actions";

describe('Update Task', ()=>{
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    
    // Retrieves task from current user with given id
    // let curr_task = async (id:string)=> {
    //     let curr_user = await CurrentUser.get_user();
    //     return await curr_user!.tasks!.findById(id);
    // }

    // Id of task we want to update in these tests
    // let task_id = "yDhmq7jgnaFA9eogwekG"

    /************************************
     * Test Start
    ************************************/
    it('updates order', async ()=>{
        let task = await create_task({order:1, name:"Changes order from 1 to 2"});
        task = await update_task(task.id, {order: 2});
        return expect(task.order).toBe(2);
    });

    it('updates name', async ()=>{
        let task = await create_task({order: 1, name: "Original Name"});
        let update_name:string = "Name Updated"
        task = await update_task(task.id, {name: update_name});
        return expect(task.name).toBe(update_name);
    });

    it('updates notes (the description)', async ()=> {
        let task = await create_task({order: 1, name: "Test Update Notes"});
        let update_notes:string = "This task was updated by create_delete_task.test.ts";
        task = await update_task(task.id, {notes: update_notes});
        return expect(task.notes).toBe(update_notes);
    });

    afterAll(async ()=> {
        firebase.auth().signOut();
    })
});