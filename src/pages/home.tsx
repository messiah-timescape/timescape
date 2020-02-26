import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from "@ionic/react";
import React from "react";
import homepageGraphic from "../assets/homepage-graphic.png";
import "../styles/Home.scss";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Home</h1>
        <img src={homepageGraphic} className="homepage-graphic" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
