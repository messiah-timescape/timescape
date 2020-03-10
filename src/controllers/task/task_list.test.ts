import task_sync from "./task_list";
import init_app from "../../init_app";

beforeAll( () => {
    init_app();
});

it('should retrieve an initial list of users when called', async () => {
    let task_list = await task_sync(()=>{});
    expect(task_list.tasks.length).toBeGreaterThan(0);
    expect(task_list.groups.length).toBeGreaterThan(0);
});