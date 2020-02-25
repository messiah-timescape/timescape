import { IonContent, IonInput, IonItem, IonButton, IonIcon } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png";
import googleLogin from "../assets/googleIcon.png";
import "../styles/Login.scss";
import { Route } from "react-router";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);
   
    return (
      <React.Fragment>        
        <IonContent class="ion-padding">
          <div className="div-content">
            <h1>Login</h1>

          <form>
            <IonItem className="input">
              <IonInput name="user" placeholder="Email or Username" required></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput name="password" placeholder="Password" type={showPassword ? 'text' : 'password'} required></IonInput>
              <IonIcon icon={passwordIcon} onClick={function () {setShowPassword(!showPassword); if(passwordIcon == eye){setPasswordIcon(eyeOff)} else{setPasswordIcon(eye);}}}></IonIcon>
            </IonItem>

            <p className="link-text">Forgot Password?</p>

            <IonButton className="button" type="submit">Login</IonButton>
          </form>

            

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

