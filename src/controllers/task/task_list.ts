import { Task } from "../../models";
import moment from "moment";
import { CollectionList } from "../list_class";

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

class TaskList extends CollectionList<Task>{
  groups: TaskGroup[] = [];
  tasks = this.model_array;
  static async create(change_state: Function,  initial_length?):Promise<TaskList> {
    let list = super._create<Task,TaskList>(TaskList, "tasks", change_state, initial_length);
    return list;
  }

  add_group(name: string, group_condition: (task) => boolean) {
    this.groups.push(new TaskGroup(this.groups.length, name, group_condition));
  }

  by_groups() {
    
    for (let i = 0; i < this.groups.length; i++) {
      const group = this.groups[i];
      group.tasks = [];
    }
    
    this.model_array.forEach(task => {
      for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        if (task && group.group_condition(task)) {
          group.tasks.push(task);
          break;
        }
      }
    });
    return this.groups;
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
