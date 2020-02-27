import CurrentUser from "./user";
import firebase from "firebase";

export let store_survey = (work_limit:string, sleep_start:DOMHighResTimeStamp, sleep_stop:DOMHighResTimeStamp,
    // work_days:Array<string>, work_start:DOMHighResTimeStamp, work_stop:DOMHighResTimeStamp) => {
    // let curr_user_id = firebase.auth().currentUser.uid!;
    // const db = firebase.firestore();
    // return db.collection('user').doc(curr_user_id).update({
    //     "settings.overwork_limit": work_limit,
    //     "settings.sleep_start": sleep_start,
    //     "settings.sleep_stop": sleep_stop,
    //     "settings.work_days": work_days,
    //     "settings.work_start_time": work_start,
    //     "settings.work_stop_time": work_stop
    // });
}