import React, {useState, useEffect} from "react";
import { IonPage, IonContent, IonItem, IonLabel, IonItemGroup, IonText, IonButton, IonModal, IonDatetime, IonCheckbox, IonItemDivider } from "@ionic/react";
import "../styles/Settings.scss";

import moment from "moment";
import Weekdays from "../utils/weekdays";
import CheckAuth from "../helpers/CheckAuth";
import user from "../controllers/user/index";
// import { get_settings } from "../controllers/user/settings";
const Settings: React.FC = () => {

    const [edit, setEdit] = useState(false);
    //------------Replace moment with data from database-----------
    //  - Right now overworkLimit, startWork, and stopWork have test moment values
    //  - Giving them moments from the database is all thats needed to update the display
    const [overworkLimit, updateOverworkLimit] = useState(moment({hour: 3, minute: 30}));
    const [startWork, updateStartWork] = useState(moment({hour: 8, minute: 0}));
    const [stopWork, updateStopWork] = useState(moment({hour: 15, minute: 30}));

    //-----------isChecked determans if the Weekday is a workday for user-----------
    //  - Test values: everything is true
    //  - workdays is an object array for each day of the week
    //  - if isChecked is true for an object then val is a Weekday the user has marked as a workday
    //  ** If this was a dumb way of doing it let me know, I'll fix it **
    const [workdays] = useState([
        {val: Weekdays.Monday, isChecked: true},
        {val: Weekdays.Tuesday, isChecked: true},
        {val: Weekdays.Wednesday, isChecked: true},
        {val: Weekdays.Thursday, isChecked: true},
        {val: Weekdays.Friday, isChecked: true},
        {val: Weekdays.Saturday, isChecked: true},
        {val: Weekdays.Sunday, isChecked: true}
    ]);

    const [currentUser, setCurrentUser] = useState(String);
    let token = user.get_loggedin();

    token.then(function (result) {
        if (result) {
        setCurrentUser(result.display_name || result.email);
        }
    });

    //--------------Pulls all the data enterd from the edit modal and sets the new values--------------
    function saveSettings(start, stop, limit, m, t, w, r, f, s, u) {
        console.log("Settings SHALL BE SAVED!!!");
        console.log("");
        console.log("----------Before-Updates----------");
        console.log("startWork: ", startWork);
        console.log("stopWork: ", stopWork);
        console.log("overworkLimit: ", overworkLimit);
        console.log("Monday: ", workdays[0]);
        console.log("Tuesday: ", workdays[1]);
        console.log("Wednesday: ", workdays[2]);
        console.log("Thursday: ", workdays[3]);
        console.log("Friday: ", workdays[4]);
        console.log("Saturday: ", workdays[5]);
        console.log("Sunday: ", workdays[6]);

        //----------Updates the variables so all changes are displayed-----------

        // parseZone is used to keep the time the same but also fix deprecation issues
        updateStartWork(moment.parseZone(start));
        updateStopWork(moment.parseZone(stop));
        updateOverworkLimit(moment.parseZone(limit));

        workdays[0].isChecked = m;
        workdays[1].isChecked = t;
        workdays[2].isChecked = w;
        workdays[3].isChecked = r;
        workdays[4].isChecked = f;
        workdays[5].isChecked = s;
        workdays[6].isChecked = u;
        //-----------End--------------

        console.log("");
        console.log("----------After-Updates----------");
        console.log("startWork: ", startWork);
        console.log("stopWork: ", stopWork);
        console.log("overworkLimit: ", overworkLimit);
        console.log("Monday: ", workdays[0]);
        console.log("Tuesday: ", workdays[1]);
        console.log("Wednesday: ", workdays[2]);
        console.log("Thursday: ", workdays[3]);
        console.log("Friday: ", workdays[4]);
        console.log("Saturday: ", workdays[5]);
        console.log("Sunday: ", workdays[6]);

        // Makes the modal go away
        setEdit(false);
    }

    useEffect(() => {
        CheckAuth();
    }, []);

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonItem lines="none">
                    <h1>Settings</h1>
                </IonItem>
                
                <IonItemGroup>
                    <IonLabel>
                        <h1>{currentUser}</h1>
                    </IonLabel>
                    <IonItem lines="none"></IonItem>
                </IonItemGroup>

                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>
                            <h1>Personal</h1>
                        </IonLabel>
                        <IonButton fill="clear" slot="end" onClick={() => setEdit(true)}>edit</IonButton>
                    </IonItemDivider>
                    <IonItem lines="none">
                        <IonText>
                            <p>Start Work:</p>
                        </IonText>
                        <IonText slot="end">
                            <p>{startWork.format('LT')}</p>
                        </IonText>
                    </IonItem>

                    <IonItem lines="none">
                        <IonText>
                            <p>Stop Work:</p>
                        </IonText>
                        <IonText slot="end">
                            <p>{stopWork.format('LT')}</p>
                        </IonText>
                    </IonItem>

                    <IonItem lines="none">
                        <IonText>
                            <p>Avg Work Period:</p>
                        </IonText>
                        <IonText slot="end">
                            <p>{overworkLimit.format('H:mm')}</p>
                        </IonText>
                    </IonItem>

                    <IonItem lines="none">
                        <IonText>
                            <p>Work Days:</p>
                        </IonText>
                        <IonText slot="end">
                            <p>
                                { workdays[0].isChecked ? workdays[0].val.toString() + ", "  : "" }
                                { workdays[1].isChecked ? workdays[1].val.toString() + ", " : "" }
                                { workdays[2].isChecked ? workdays[2].val.toString() + ", " : "" }
                                { workdays[3].isChecked ? workdays[3].val.toString() + ", " : "" }
                                { workdays[4].isChecked ? workdays[4].val.toString() + ", " : "" }
                                { workdays[5].isChecked ? workdays[5].val.toString() + ", " : "" }
                                { workdays[6].isChecked ? workdays[6].val.toString() + ", " : "" }
                            </p>
                        </IonText>
                    </IonItem>
                </IonItemGroup>

                <IonModal
                    isOpen={edit}
                    onDidDismiss={() => setEdit(false)}
                >
                    <IonContent className="ion-padding">
                        <IonItem lines="none">
                            <IonText 
                                slot="end"
                                onClick={() => setEdit(false)}
                            >
                                cancel
                            </IonText>
                            <IonText 
                                slot="end"
                                color="primary"
                                onClick={() => saveSettings(
                                    (document.getElementById("start-work") as HTMLInputElement).value,
                                    (document.getElementById("stop-work") as HTMLInputElement).value,
                                    (document.getElementById("interval") as HTMLInputElement).value,
                                    (document.getElementById("0") as HTMLInputElement).checked,
                                    (document.getElementById("1") as HTMLInputElement).checked,
                                    (document.getElementById("2") as HTMLInputElement).checked,
                                    (document.getElementById("3") as HTMLInputElement).checked,
                                    (document.getElementById("4") as HTMLInputElement).checked,
                                    (document.getElementById("5") as HTMLInputElement).checked,
                                    (document.getElementById("6") as HTMLInputElement).checked
                                    )
                                }
                            >
                                save
                            </IonText>
                        </IonItem>

                        <IonItemGroup>
                            <IonItem lines="none">
                                <IonLabel>Start Work:</IonLabel>
                                <IonDatetime
                                    id="start-work" 
                                    value={startWork.toString()}
                                    displayFormat="h:mm A"
                                >
                                </IonDatetime>
                            </IonItem>

                            <IonItem lines="none">
                                <IonLabel>Stop Work:</IonLabel>
                                <IonDatetime 
                                    id="stop-work"
                                    value={stopWork.toString()}
                                    displayFormat="h:mm A"
                                >
                                </IonDatetime>
                            </IonItem>

                            <IonItem>
                                <IonLabel>Avg Work Period:</IonLabel>
                                <IonDatetime 
                                    id="interval"
                                    value={overworkLimit.toString()}
                                    displayFormat="H:mm"
                                >
                                </IonDatetime>
                            </IonItem>
                        </IonItemGroup>

                        <IonItemGroup>
                            <h4>Work Days</h4>

                            {workdays.map(({ val, isChecked }, i) => (
                                <IonItem key={i}>
                                <IonLabel>{val}</IonLabel>
                                <IonCheckbox id={i.toString()} slot="end" value={val} checked={isChecked} />
                                </IonItem>
                            ))}
                        </IonItemGroup>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
