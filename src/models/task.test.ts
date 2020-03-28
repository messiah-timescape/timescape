import moment from "moment";
import init_app from "../init_app";
import firebase from "firebase";
import { User } from ".";
import CurrentUser from "../controllers/user";
import { TestLoginActions } from "../controllers/user/login.test";
import { create_task } from "../controllers/task/task_actions";

describe('Creating Task', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });

    let user: User;
    let task_name: string;
    it('creates task', async ()=> {
        user = await CurrentUser.get_loggedin();
        task_name = "Task Model Test";
        let new_task = await create_task({
            order:1,
            name: task_name,
            notes: "This is to test the working model of Task.",
            deadline: moment().add(1, 'day'),
            completed: true
        });
        if(new_task) {
            return expect(new_task.name).toBe(task_name);
        } else {
            throw new Error("Task is not defined");
        };
    });

    afterAll(()=> {
        if(user) user.tasks!.delete(task_name);
        firebase.auth().signOut();
    })
});