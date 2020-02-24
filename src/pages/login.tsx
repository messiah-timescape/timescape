import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonButton } from "@ionic/react";
import React from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png"
import "../styles/Login.scss";

const Login: React.FC = () => {
    return (
      <React.Fragment>        
        <img src={topImage} />
        <IonContent class="ion-padding">
          <div className="div-content">
            <h1>Login</h1>

            <IonItem>
              <IonInput placeholder="Email" required></IonInput>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Password" required></IonInput>
            </IonItem>

            <p>Forgot Password?</p>

            <IonButton className="button" fill="solid" size="default" color="#FDD036">Login</IonButton>
          </div>
          
        </IonContent>
      <img src={bottomImage} />
      </React.Fragment>
    );
  };
  export default Login;
