import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "../styles/AddTask.scss";

const AddTask: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <p className="save-button">Save</p>
      </IonContent>
      <hr></hr>
    </IonPage>
  );
};

export default AddTask;
