import firebase from "firebase/app";
import { User } from "../../models";
import CurrentUser from "../user";
import { CollectionList } from "../list_class";

class TagList<Model> {
  update_fn: Function;
  stop_updates_fn?: Function;
  current_user: User;
  model_array: Model[] = [];
  collection_name: string;

  static async create<Model>(change_state: Function, collection_name:string,  initial_length = 100) {
    let current_user = await CurrentUser.get_loggedin();
    let model_list = new CollectionList<Model>(current_user, change_state, collection_name, initial_length);
    model_list.stop_updates_fn = firebase
      .app()
      .firestore()
      .collection("user")
      .doc(current_user.id)
      .collection(model_list.collection_name)
      .onSnapshot(model_list.update());
    // task_list.update_fn(task_list.by_groups());
    return model_list;
  }

  update() {
    let that = this;
    return async (query_snapshot: firebase.firestore.QuerySnapshot) => {
      
      let changes = query_snapshot.docChanges();
      let promises:Promise<void>[] = [];
      for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        let model_id = change.doc.get("id");
        let org_model = that.current_user[this.collection_name][change.oldIndex];
        if (change.type === "removed" || change.type === "modified") {
          that.model_array.splice(change.oldIndex, 1);
        }
        if (change.type === "added" || change.type === "modified") {
          that.model_array.splice(change.newIndex, 0, org_model);
          promises.push(that.current_user[this.collection_name].findById(model_id).then( new_task => {
            that.model_array[change.newIndex] = new_task;
          }));
        }
      }
    };
  }

  constructor(current_user: User, update_fn: Function, collection_name:string, initial_length:number) {
    this.current_user = current_user;
    this.update_fn = update_fn;
    this.collection_name = collection_name;
  }
}
