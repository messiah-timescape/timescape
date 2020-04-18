import moment, { Moment } from "moment";
import firebase from "firebase";
import {google} from "googleapis";
import {ReportTaskInfo} from "../reports/reports";
import { Period } from "../../models";

export async function get_events(start_datetime:Moment, end_datetime:Moment) {
    let result = await firebase.auth().getRedirectResult(); 
    if ( result.credential) {
        let token = (result.credential as firebase.auth.OAuthCredential).accessToken;
        if ( !token) return;
        let oauth_client = new google.auth.OAuth2(
            "293865584542-chjfvkd1opcovopihb0ujlki3dc48a2r.apps.googleusercontent.com",
            "jT-tZFmQepNvC7swIWxEqGCn"
        );
        oauth_client.getToken(token);
        let calendar = google.calendar({version: "v3",auth: oauth_client});
        let event_list = await calendar.events.list({
            calendarId: "primary",

        });
        return event_list.data.items?.map( event => {
            if ( event.start?.dateTime && event.end?.dateTime)
                return new ReportTaskInfo({
                    work_period: new Period(moment(event.start?.dateTime), moment(event.end?.dateTime))
                });
        });
    }
}