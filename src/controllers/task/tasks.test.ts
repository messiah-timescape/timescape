import task_sync from "./task_list";
import moment from "moment";
import init_app from "../../init_app";
import firebase from "firebase";
import { Task } from "../../models/task";
import { create_task, delete_task, complete_task } from "./task_actions";
import { TestLoginActions } from "../user/login.test";
import CurrentUser from "../user";

describe("Task List", ()=> {
    beforeAll(async () => {
        init_app();
        return await TestLoginActions.email_password();
    });

    it('should retrieve an initial list of tasks when called', async done => {
        expect.assertions(2);
        let task_list = await task_sync(()=>{
            expect(task_list.tasks.length).toBeGreaterThan(0);
            expect(task_list.groups.length).toBeGreaterThan(0);

            done();
        });
        
    });

    it('creates task', async ()=> {
        let task:Task;
        let task_name = "Check off as complete";
        let task_order = 1;
        let task_deadline = moment();
        try{
            task = await create_task({
                name: task_name,
                order: task_order,
                deadline: task_deadline
            });
        } catch(err) {
            throw err;
        }
        if(task !== undefined) {
            return expect(task.name).toBe(task_name);
        }
        else throw new Error("\nMESSAGE from create_task.test.ts: Task is undefined.\n");
    });

    it('marks task as complete', async ()=>{
        let task = await create_task({order:1, name: "Testing Completed"});
        task = await complete_task(task.id);
        return expect(task.completed).toBeTruthy();
    });
    
    it('deletes the task', async ()=> {
        let task = await create_task({order: 1, name: "Testing Deleted"});
        await delete_task(task.id);
        let curr_user = await CurrentUser.get_user();
        task = await curr_user!.tasks!.findById(task.id);
        return expect(task).toBe(null);
    });

    afterAll(async ()=> {
        let curr_user = await CurrentUser.get_loggedin();
        let completed_task = await curr_user.tasks.whereEqualTo("name", "Testing Completed").findOne();
        let created_task = await curr_user.tasks.whereEqualTo("name", "Check off as complete").findOne();
        await delete_task(completed_task!.id);
        await delete_task(created_task!.id);
        firebase.auth().signOut();
    })
});