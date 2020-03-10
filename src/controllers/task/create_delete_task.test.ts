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
    
    let task_factory = async (init_task:Partial<Task>)=> {
        let new_task = await create_task(init_task);
        return new_task;
    }

    let to_be_deleted:(string)[];

    it('creates task', async ()=> {
        let new_task:Partial<Task>;
        let title = "Created New Task Test";
        new_task = await task_factory({
            name: title,
            order: 1,
            notes: "This was a task created by our test."
        });
        console.log(new_task.to_json);
       
        if(new_task.id!==undefined)
            to_be_deleted.push(new_task.id);
            console.log("From created: ", to_be_deleted.toString());
        expect(new_task.name).toBe(title);
    });

    it('marks task as complete', async ()=>{
        let task = await task_factory({
            name: "Completeing Task Test",
            notes: "This task was created by our test."
        });
        let task_complete = await complete_task(task.id);
        to_be_deleted.push(task_complete.id);
        console.log("From completed: ", to_be_deleted.toString());
        return expect(task_complete.completed).toBeTruthy();
    }); 

    it('deletes the task', async ()=> {
        let task = await task_factory({
            name: "Deleting Task Test",
            notes: "This task was created by our test."
        });
        await delete_task(task.id);
        let curr_user = await CurrentUser.get_user();
        task = await curr_user!.tasks!.findById(task.id);
        return expect(task).toBe(null);
    });

    afterEach(async ()=> {
        for(var value of to_be_deleted) {
            await delete_task(value);
        }
    });

    afterAll(async ()=> {
        firebase.auth().signOut();
    })

});