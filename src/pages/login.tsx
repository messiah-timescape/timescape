import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import React from "react";
import Card from "../components/Card";

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Login</h1>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </IonContent>
    </IonPage>
  );
};

export default Login;
