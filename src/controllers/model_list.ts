import firebase, { firestore } from "firebase/app";
import { User } from "../models";
import CurrentUser from "./user";

export class CollectionList<Model> {
  update_fn: Function;
  stop_updates_fn?: Function;
  current_user: User;
  model_array: Model[] = [];
  collection_name: string;
  post_update_hook?: Function;
  query!: firestore.Query;
  initial_page_length?: number;
  page_length?: number;
  page:number = 0;
  first_call_after_page_added:boolean = false;

  constructor(current_user: User, update_fn: Function, collection_name:string, page_length?) {
    this.current_user = current_user;
    this.update_fn = update_fn;
    this.collection_name = collection_name;
    this.initial_page_length = page_length;
    this.page_length = page_length;


    this.setup_snapshots();
  }

  setup_snapshots() {
    if ( this.stop_updates_fn ) {
      this.stop_updates_fn();
    }
    this.query = this.construct_query();
    if ( this.initial_page_length && this.page > 0 ) {
      this.query = this.query.startAfter(this.page * this.initial_page_length);
    }
    this.stop_updates_fn = this.query.onSnapshot(this.update());
  }
  
  static async _create<Model, ModelList extends CollectionList<Model>>
  (instance, collection_name:string, change_state: Function, page_length?:number)
  :Promise<ModelList> {
    let current_user = await CurrentUser.get_loggedin();
    let model_list:ModelList = new instance(current_user, change_state, collection_name, page_length);
    // task_list.update_fn(task_list.by_groups());
    return model_list;
  }

  construct_query():firestore.Query {
    let query:firestore.Query = firebase
      .app()
      .firestore()
      .collection("user")
      .doc(this.current_user.id)
      .collection(this.collection_name);
    if ( this.page_length ) {
      query = query.limit(this.page_length);
    }
    return query;
  }

  add_page() {
    if (this.initial_page_length && this.page_length) {
      this.page_length += this.initial_page_length;
      this.first_call_after_page_added = true;
      this.setup_snapshots();
    }
  }

  next_page() {
    if (this.initial_page_length) {
      this.page++;
      this.model_array = [];
      this.setup_snapshots();
    }
  }

  previous_page() {
    if (this.initial_page_length) {
      this.page--;
      this.setup_snapshots();
    }
  }

  update() {
    let that = this;
    return async (query_snapshot: firebase.firestore.QuerySnapshot) => {
      
      let changes = query_snapshot.docChanges();
      //TODO: Make sure the other one works
      let preindex = true; //changes.length > 10;
      
      let find_model:(id:string) => Model;
      if ( preindex ) {
        let indexed_models = {};
        await (await that.current_user[this.collection_name].find()).forEach( (model) => {
          indexed_models[model.id] = model;
        });
        find_model = (id) => indexed_models[id];
      } else {
        find_model = await that.current_user[this.collection_name].findById;
      }

      if ( that.first_call_after_page_added ) {
        that.first_call_after_page_added = false;
        that.model_array = [];
      }
      for (let i = 0; i < changes.length; i++) {
        let change = changes[i];
        let model_id = change.doc.id;

        let org_model = that.current_user[this.collection_name][change.oldIndex];
        if (change.type === "removed" || change.type === "modified") {
          that.model_array.splice(change.oldIndex, 1);
        }
        if (change.type === "added" || change.type === "modified") {
          that.model_array.splice(change.newIndex, 0, org_model);
          
          that.model_array[change.newIndex] =  await find_model(model_id);
        }
      }
      let list = that.model_array;
      if (that.post_update_hook){
        list = that.post_update_hook.apply(that);
      }
      that.update_fn(list);
    };
  }
}
