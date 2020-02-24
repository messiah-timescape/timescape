import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonButton, IonIcon } from "@ionic/react";
import React from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png";
import googleLogin from "../assets/googleLogin.png";
import "../styles/Login.scss";

const Login: React.FC = () => {
    return (
      <React.Fragment>        

        <IonContent class="ion-padding">
          <div className="div-content">
            <h1>Login</h1>

          <div className="field">
            <IonItem className="input">
              <IonInput placeholder="Email or Username" required></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput placeholder="Password" type="password" required></IonInput>
            </IonItem>
          </div>

            <p className="link-text">Forgot Password?</p>

            <IonButton className="button">Login</IonButton>

            <div className="alt-login">
              <img src={googleLogin} />

              <p>Don't have an account?<br /><span className="link-text">Sign Up</span></p>
            </div>
          </div>
        </IonContent>
        <img id="top-border" src={topImage} />
        <img id="bot-border" src={bottomImage} />
      </React.Fragment>
    );
  };
  export default Login;