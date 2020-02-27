import moment from "moment";
import { store_survey } from "./survey";
import init_app from "../../init_app";
import firebase from "firebase";
import Weekdays from "../../utils/weekdays";
import { Moment } from "moment";

describe('Store User Survey Data', ()=> {
    beforeAll(()=> {
        init_app();
    });
    it('stores survey data', ()=> {
        let work_limit:string = "PT5H";
        let sleep_start:Moment = moment().hour(22);
        let sleep_stop:Moment = moment().hour(8);
        let work_days:Weekdays[] = new Array(1);
        let work_start:Moment = moment().hour(8).minute(30);
        let work_stop:Moment = moment().hour(11);
    
        return store_survey(work_limit, sleep_start, sleep_stop,
            work_days, work_start, work_stop);
    });
    afterAll(()=>{
        firebase.auth().signOut();
    });
});
