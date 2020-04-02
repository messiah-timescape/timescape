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

    it('must return a number of tasks less than the page size, even if next or previous page is called', async done => {
        let times_called = 0;
        let task_list = await task_sync(()=>{
            times_called++;
            expect(task_list.tasks.length).toBeGreaterThan(0);
            expect(task_list.tasks.length).toBeLessThanOrEqual(20);
            expect(task_list.groups.length).toBeGreaterThan(0);
            
            if (times_called === 1)
                task_list.next_page();
            
            if (times_called === 2)
                task_list.previous_page();

            if (times_called > 2)
                done();
        }, 20);
    });

    it('must return double the number of tasks once next_page is called', async done => {
        let times_called = 0;
        let task_list = await task_sync(()=>{
            times_called++;
            console.log("Time: ", times_called, task_list.tasks.map(task => task.id));
            if ( times_called === 1 && task_list.tasks.length < 20 ) {
                task_list.stop_updates_fn!();
                done();
            } else {
                task_list.add_page();
            }
            
            if ( times_called === 2 ) {
                expect(task_list.tasks.length).toBeGreaterThanOrEqual(20);
                expect(task_list.tasks.length).toBeLessThanOrEqual(40);
            }

            if (times_called > 1)
                done();
        }, 20);
    })

    it('creates task', async ()=> {
        let task:Task;
        let task_name = "Check off as complete";
        let task_order = 1;
        let task_deadline = moment();
        let task_tag = await (await (CurrentUser.get_loggedin())).tags.findOne()
        try{
            task = await create_task({
                name: task_name,
                order: task_order,
                deadline: task_deadline,
                tag: (task_tag)?task_tag:undefined
            });
        } catch(err) {
            throw err;
        }
        if(task !== undefined) {
            expect(task.name).toBe(task_name);
            if ( task.tag )
                expect(task.tag.id).toBe(task_tag!.id);
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
        await Promise.all([
            curr_user.tasks.whereEqualTo("name", "Testing Completed").findOne().then(completed_task=>{
                return delete_task(completed_task!.id);
            }),
            curr_user.tasks.whereEqualTo("name", "Check off as complete").findOne().then(created_task => {
                return delete_task(created_task!.id);
            })
        ]).then(() => {
            firebase.auth().signOut();
        });
        
    })
});