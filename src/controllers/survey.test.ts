import { now } from "moment";
import { store_survey } from "./survey";
import init_app from "../init_app";
import firebase from "firebase";

describe('Store User Survey Data', ()=> {
    beforeAll(()=> {
        init_app();
    });
    it('stores survey data', ()=> {
        let work_limit:string = "PT5H";
        let sleep_start:DOMHighResTimeStamp = now();
        let sleep_stop:DOMHighResTimeStamp = now();
        let work_days:Array<string> = ["mon", "wed"];
        let work_start:DOMHighResTimeStamp = now();
        let work_stop:DOMHighResTimeStamp = now();
    
        return store_survey(work_limit, sleep_start, sleep_stop,
            work_days, work_start, work_stop);
    });
    afterAll(()=>{
        firebase.auth().signOut();
    });
});
