import firebase from "firebase/app";
import { Task, User } from "../../models";
import CurrentUser from "../user";
import moment from "moment";

class TaskGroup {
  name: string;
  group_condition: (task) => boolean;
  tasks: Task[] = [];
  constructor(index: number, name: string, group_condition: (task) => boolean) {
    this.name = name;
    this.group_condition = group_condition;
    this.index = index;
  }
  index: number;
}

class TaskList {
  update_fn: Function;
  stop_updates_fn?: Function;
  current_user: User;
  tasks: Task[] = [];
  groups: TaskGroup[] = [];

  static async create(change_state: Function, initial_length = 100) {
    let current_user = await CurrentUser.get_loggedin();
    // let initial_tasks = await current_user.tasks.limit(initial_length).find();
    let task_list = new TaskList(current_user, change_state);
    console.log("UPDATE")
    // initial_tasks.forEach(task => {
    //   task_list.tasks.push(task);
    // });
    task_list.stop_updates_fn = firebase
      .app()
      .firestore()
      .collection("user")
      .doc(current_user.id)
      .collection("tasks")
      .onSnapshot(task_list.update());
    // task_list.update_fn(task_list.by_groups());
    return task_list;
  }

  add_group(name: string, group_condition: (task) => boolean) {
    this.groups.push(new TaskGroup(this.groups.length, name, group_condition));
  }

  by_groups() {
    
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];
      group.tasks = [];
    }
    
    this.tasks.forEach(task => {
      for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        if (group.group_condition(task)) {
          group.tasks.push(task);
          break;
        }
      }
    });
    return this.groups;
  }

  update() {
    let that = this;
    return async (query_snapshot: firebase.firestore.QuerySnapshot) => {
      
      let changes = query_snapshot.docChanges();
      let promises:Promise<void>[] = [];
      for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        let task_id = change.doc.get("id");
        let org_task = that.current_user.tasks[change.oldIndex];
        if (change.type === "removed" || change.type === "modified") {
          that.tasks.splice(change.oldIndex, 1);
        }
        if (change.type === "added" || change.type === "modified") {
          that.tasks.splice(change.newIndex, 0, org_task);
          promises.push(that.current_user.tasks.findById(task_id).then( new_task => {
            that.tasks[change.newIndex] = new_task;
          }));
        }
      }
      Promise.all(promises).then( () => {
        that.update_fn(that.by_groups.apply(that));
      });
    };
  }

  constructor(current_user: User, update_fn: Function, initial_length = 100) {
    //query:firebase.firestore.Query) {
    this.current_user = current_user;
    this.update_fn = update_fn;
  }
}

function task_sync(change_state: Function): Promise<TaskList> {
  return new Promise<TaskList>(async (resolve, reject) => {
    let task_list = await TaskList.create(change_state);
    task_list.add_group("Due today", (task: Task) => {
      return task.deadline && moment(task.deadline).isSame(moment(), "day");
    });
    task_list.add_group("Due tomorrow", (task: Task) => {
      return task.deadline && moment(task.deadline).isSame(moment().add(1, "day"), "day");
    });
    task_list.groups.push(
      new TaskGroup(100, "Completed", (task: Task) => {
        return task.completed;
      })
    );
    task_list.groups.push(
      new TaskGroup(101, "Others", (task: Task) => {
        return true;
      })
    );
    resolve(task_list);
  });
}

export default task_sync;
