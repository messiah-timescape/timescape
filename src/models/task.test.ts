import { getRepository } from "fireorm";
import { Task } from "./task";
import moment from "moment";
import init_app from "../init_app";
import firebase from "firebase";
import { User } from ".";
import { TestLoginActions } from "../controllers/user/login.test";

// !WARNING: This test does NOT yet 
// DELETE the task after its creation!

describe('Creating Task', ()=> {
    beforeAll(async ()=> {
        init_app();
        await TestLoginActions.email_password();
    });

    let user: User | null;
    it('creates task', async ()=> {
        user = await getRepository(User).whereEqualTo("email", "test@test.com").findOne();
        let task = new Task({
            order: 1,
            name: "Complete test",
            notes: null,
            deadline: moment().toDate(),
            times: null,
            tag_list: null,
            Task: null,
            completed: true   
        });
        if(user) {
            let new_task = await user.tasks!.create(task);
            if(new_task) {
                return expect(new_task.name).toBe(task.name);
            } else {
                throw new Error("Task is not defined");
            };
        } else throw new Error("There is no user.");
    });

    afterAll(()=> {
        if(user) user.tasks!.delete("Complete Test");
        firebase.auth().signOut();
    })
});