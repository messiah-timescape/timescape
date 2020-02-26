import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonRouterLink } from "@ionic/react";
import React from "react";
import homepageGraphic from "../assets/homepage-graphic.png";
import "../styles/Home.scss";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Home</h1>
        <IonRouterLink href="/login">
          <h4>Login</h4>
        </IonRouterLink>
        <IonRouterLink href="/Register">
          <h4>Register</h4>
        </IonRouterLink>
        <img src={homepageGraphic} className="homepage-graphic" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
