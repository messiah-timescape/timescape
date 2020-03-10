import moment from "moment";
import init_app from "../../init_app";
import firebase from "firebase";
import { Task } from "../../models/task";
import { create_task, delete_task, complete_task } from "./task_action";
import { TestLoginActions } from "../user/login.test";
import CurrentUser from "../user";

describe('Testing Task CRUD', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    
    let new_task:Task;
    it('creates task', async ()=> {
        let task_name = "Check off as complete";
        let task_order = 1;
        let task_notes = null;
        let task_deadline = moment().toDate();
        let task_tag = null;
        try{
            new_task = await create_task(task_name, task_order, task_notes, task_deadline, task_tag);
        } catch(err) {
            throw err;
        }
        if(new_task !== undefined)
            return expect(new_task.name).toBe(task_name);
        else throw new Error("\nMESSAGE from create_task.test.ts: Task is undefined.\n");
    });

    it('marks task as complete', async ()=>{
        let task_complete = await complete_task(new_task.id);
        return expect(task_complete.completed).toBeTruthy();
    }); 

    it('deletes the task', async ()=> {
        await delete_task(new_task.id);
        let curr_user = await CurrentUser.get_user();
        let task = await curr_user!.tasks!.findById(new_task.id);
        return expect(task).toBe(null);
    });

    afterAll(async ()=> {
        firebase.auth().signOut();
    })

});