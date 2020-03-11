import task_sync from "./task_list";
import init_app from "../../init_app";
import { TestLoginActions } from "../user/login.test";

describe("Task List", ()=> {
    beforeAll(async () => {
        init_app();
        return await TestLoginActions.email_password();
    });

    it('should retrieve an initial list of users when called', async done => {
        expect.assertions(2);
        let task_list = await task_sync(()=>{
            expect(task_list.tasks.length).toBeGreaterThan(0);
            expect(task_list.groups.length).toBeGreaterThan(0);

            done();
        });
        
    });
});