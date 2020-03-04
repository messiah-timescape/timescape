import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import CheckAuth from "../helpers/CheckAuth";

const Calendar: React.FC = () => {
  CheckAuth();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Calendar</h1>
      </IonContent>
    </IonPage>
  );
};
export default Calendar;
