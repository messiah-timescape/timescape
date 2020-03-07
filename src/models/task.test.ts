import { getRepository } from "fireorm";
import { Task } from "./task";
import moment from "moment";
import init_app from "../init_app";
import firebase from "firebase";
import { userlogin_email_password } from "../controllers/user/login";
import { User } from ".";
import CurrentUser from "../controllers/user";

// !WARNING: This test does NOT yet 
// DELETE the task after its creation!

describe('Creating Task', ()=> {
    beforeAll(()=> {
        init_app();
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
        console.log(task.to_json());
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