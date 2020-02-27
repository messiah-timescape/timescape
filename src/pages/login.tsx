import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonPage,
  IonRouterLink
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png";
import googleLogin from "../assets/googleIcon.png";
import "../styles/Login.scss";
import { userlogin_email_password } from "../controllers/user/login";
import init_app from "../init_app";

init_app();

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [showWrongCredentials, setShowWrongCredentials] = useState(false);

  function handleSubmit(username: string, password: string) {
    userlogin_email_password(username, password).then(successfulLogin, failedLogin);

    function successfulLogin() {
      setShowWrongCredentials(false);
      window.location.href = "http://localhost:3000/home";
    }

    function failedLogin() {
      setShowWrongCredentials(true);
    }
  }

  return (
    <IonPage>
      <IonContent class="ion-padding">
        <img id="top-border" src={topImage} />
        {/* <img id="bot-border" src={bottomImage} /> */}
        <div className="div-content">
          <h1>Login</h1>

          <form className="form-login">
            <IonItem className="input">
              <IonInput
                name="user"
                placeholder="Email or Username"
                id="username-field"
                required
              ></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput
                name="password"
                placeholder="Password"
                id="password-field"
                type={showPassword ? "text" : "password"}
                required
              ></IonInput>
              <IonIcon
                icon={passwordIcon}
                onClick={function() {
                  setShowPassword(!showPassword);
                  if (passwordIcon == eye) {
                    setPasswordIcon(eyeOff);
                  } else {
                    setPasswordIcon(eye);
                  }
                }}
              ></IonIcon>
            </IonItem>
            {showWrongCredentials ? (
              <p className="wrong-password-text">Incorrect username or password.</p>
            ) : (
              <p></p>
            )}

            <p className="link-text">Forgot Password?</p>

            <IonButton
              className="button"
              onClick={() =>
                handleSubmit(
                  (document.getElementById("username-field") as HTMLInputElement).value,
                  (document.getElementById("password-field") as HTMLInputElement).value
                )
              }
            >
              Login
            </IonButton>
          </form>
          <IonRouterLink href="/home">Home</IonRouterLink>
          <div className="alt-login">
          <img id="googlePic" src={googleLogin} />
          <p>
            Don't have an account?
            <br />
            <IonRouterLink href="/register" className="link-text">
              Sign Up
            </IonRouterLink>
          </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Login;
