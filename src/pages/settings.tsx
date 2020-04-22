import React, {useState, useEffect} from "react";
import { IonPage, IonContent, IonItem, IonDatetime, IonLabel, IonGrid, IonRow, IonCol, IonItemGroup } from "@ionic/react";
import "../styles/Settings.scss";

import CheckAuth from "../helpers/CheckAuth";
const Settings: React.FC = () => {

    useEffect(() => {
        CheckAuth();
    }, []);

    const [overworkLimit, updateOverworkLimit] = useState("12:30");
    const [startWork, updateStartWork] = useState("8:00 AM");
    const [stopWork, updatestopWork] = useState("3:30 PM");

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1>Settings</h1>
                
                <IonItemGroup>
                    
                </IonItemGroup>
            </IonContent>
        </IonPage>
    );
};

export default Settings;
