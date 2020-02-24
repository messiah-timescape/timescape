import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonButton } from "@ionic/react";
import React from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png"
import "../styles/Login.scss";

const Login: React.FC = () => {
    return (
      <React.Fragment>        
        
        <IonContent class="ion-padding">
          <div className="div-content">
            <h1>Login</h1>

          <div className="field">
            <IonItem className="input">
              <IonInput placeholder="Email" required></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput placeholder="Password" required></IonInput>
            </IonItem>
          </div>

            <p>Forgot Password?</p>

            <IonButton className="button">Login</IonButton>
          </div>
        </IonContent>
        <img id="top-border" src={topImage} />
        <img id="bot-border" src={bottomImage} />
      </React.Fragment>
    );
  };
  export default Login;