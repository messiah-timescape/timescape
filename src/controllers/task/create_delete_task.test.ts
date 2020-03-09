import moment from "moment";
import init_app from "../../init_app";
import firebase from "firebase";
import { Task } from "../../models/task";
import { create_task, delete_task } from "./create_task";
import { TestLoginActions } from "../user/login.test";
import CurrentUser from "../user";

describe('Testing Task CRUD', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });
    
    let new_task:Task;
    it('creates task', async ()=> {
        let task_name = "MAKE DELETE WORK";
        let task_order = 1;
        let task_notes = null;
        let task_deadline = moment().toDate();
        let task_tag = null;
        try{
            console.log("CREATING", task_name);
            new_task = await create_task(task_name, task_order, task_notes, task_deadline, task_tag);
        } catch(err) {
            throw err;
        }
        if(new_task != undefined)
            return expect(new_task.name).toBe(task_name);
        else throw new Error("\n MESSAGE from create_task.test.ts: Task is undefined.\n");
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