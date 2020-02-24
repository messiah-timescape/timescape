import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import React from "react";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="page-header">
          <h1>Home</h1>
          <p>How's your day going?</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
