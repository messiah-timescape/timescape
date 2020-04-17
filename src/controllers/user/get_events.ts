import { Moment } from "moment";
import firebase from "firebase";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";

export async function get_events(start_datetime:Moment, end_datetime:Moment) {
    firebase.auth().getRedirectResult().then( result => {
        if ( result.credential) {
            let token = (result.credential as firebase.auth.OAuthCredential).accessToken;
            if ( !token) return;
            let oauth_client = new google.auth.OAuth2(
                "293865584542-chjfvkd1opcovopihb0ujlki3dc48a2r.apps.googleusercontent.com",
                "jT-tZFmQepNvC7swIWxEqGCn"
            );
            oauth_client.getToken(token);
            let calendar = google.calendar({version: "v3",auth: oauth_client});
            calendar.events.list().then(event_list => {
                event_list.data.items?.map( event => {
                    return new ReportTask();
                });
            })
        }
    });
}