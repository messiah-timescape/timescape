
import firebase from 'firebase/app';
import {Task, User} from '../../models'
import CurrentUser from '../user';
import moment from 'moment';


class TaskGroup {
    name:string;
    group_condition:((task) => boolean);
    tasks:Task[] = [];
    constructor (index:number, name:string, group_condition:((task) => boolean)) {
        this.name = name;
        this.group_condition = group_condition;
        this.index = index;
    }
    index:number;

}

class TaskList {

    update_fn: Function;
    stop_updates_fn?: Function;
    current_user: User;
    tasks: Task[] = [];
    groups: TaskGroup[] = [];

    static async create(change_state:Function, initial_length = 100) {
        let current_user = await CurrentUser.get_loggedin();
        let initial_tasks = await current_user.tasks.limit(initial_length).find();
        let task_list = new TaskList(current_user, change_state);
        initial_tasks.forEach((task) => {
            task_list.tasks.push(task);
        });
        task_list.stop_updates_fn = firebase.app().firestore().collection('user').doc(current_user.id)
            .collection('tasks').onSnapshot(task_list.update);
        return task_list;
    }

    add_group(...args) {
        this.groups.push(new TaskGroup(this.groups.length, args[1], args[0]));
    }
    
    by_groups() {
        this.tasks.forEach((task) => {
            for (let i = 0; i < this.groups.length; i++) {
                const group = this.groups[i];
                if ( group.group_condition(task) ) {
                    group.tasks.push(task);
                    break;
                }
            }
        });
        return this.groups;
    }
    

    update(query_snapshot:firebase.firestore.QuerySnapshot) {
        let previous_task;
        query_snapshot.docChanges().forEach(async change => {
            await previous_task;
            let task_id = change.doc.get('id');
            previous_task = this.current_user.tasks.findById(task_id);
            let new_task = await previous_task;
            if ( change.type === 'removed' || change.type === 'modified') {
                this.tasks.splice(change.oldIndex,1);
            }
            if ( change.type === 'added' || change.type === 'modified') {
                this.tasks.splice(change.newIndex, 0, new_task);
            }
        });
        this.update_fn(this.by_groups());
    }

    constructor(current_user:User, update_fn:Function, initial_length = 100){//query:firebase.firestore.Query) {
        this.current_user = current_user;
        this.update_fn = update_fn;
    }
}

function task_sync(change_state:Function):Promise<TaskList> {
    return new Promise<TaskList>( async (resolve, reject) => {
        let task_list = await TaskList.create(change_state);
        task_list.add_group((task:Task)=> {return moment(task.deadline).isSame(moment(), 'day')});
        task_list.add_group((task:Task)=> {return moment(task.deadline).isSame(moment().add(1, 'day'), 'day')});
        task_list.groups.push(new TaskGroup(100, (task:Task)=> {return task.completed}));
        task_list.groups.push(new TaskGroup(101, (task:Task)=> {return true}));
        resolve(task_list);
    });
};

export default task_sync;