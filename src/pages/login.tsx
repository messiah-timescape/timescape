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
import googleLogin from "../assets/googleIcon.png";
import "../styles/Login.scss";
import {
  userlogin_email_password,
  userlogin_google_oauth
} from "../controllers/user/login";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [showWrongCredentials, setShowWrongCredentials] = useState(false);

  function google_login() {
    userlogin_google_oauth().then(() => {
      setShowWrongCredentials(false);
      let url = window.location.href.split("/");

      url[3] = "home";
      window.location.href = url.join("/");
    });
  }

  function handleSubmit(username: string, password: string) {
    userlogin_email_password(username, password).then(
      successfulLogin,
      failedLogin
    );

    function successfulLogin() {
      setShowWrongCredentials(false);
      let url = window.location.href.split("/");
      url[3] = "home";
      window.location.href = url.join("/");
    }

    function failedLogin() {
      setShowWrongCredentials(true);
    }
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      handleSubmit(
        (document.getElementById("username-field") as HTMLInputElement).value,
        (document.getElementById("password-field") as HTMLInputElement).value
      );
    }
  }

  return (
    <React.Fragment>
      <img id="top-border" src={topImage} alt="login" />
      <IonPage>
        <IonContent class="ion-padding" color="transparent">
          <div className="div-content">
            <h1>Login</h1>

            <form className="form-login">
              <IonItem className="input">
                <IonInput
                  name="user"
                  placeholder="Email or Username"
                  id="username-field"
                  required
                  onKeyDown={e => {
                    handleKeyDown(e);
                  }}
                ></IonInput>
              </IonItem>
              <IonItem className="input">
                <IonInput
                  name="password"
                  placeholder="Password"
                  id="password-field"
                  type={showPassword ? "text" : "password"}
                  required
                  onKeyDown={e => {
                    handleKeyDown(e);
                  }}
                ></IonInput>
                <IonIcon
                  icon={passwordIcon}
                  onClick={function() {
                    setShowPassword(!showPassword);
                    if (passwordIcon === eye) {
                      setPasswordIcon(eyeOff);
                    } else {
                      setPasswordIcon(eye);
                    }
                  }}
                ></IonIcon>
              </IonItem>
              {showWrongCredentials ? (
                <p className="wrong-password-text">
                  Incorrect username or password.
                </p>
              ) : (
                <p></p>
              )}

              <p className="link-text">Forgot Password?</p>

              <IonButton
                className="button"
                onClick={() =>
                  handleSubmit(
                    (document.getElementById(
                      "username-field"
                    ) as HTMLInputElement).value,
                    (document.getElementById(
                      "password-field"
                    ) as HTMLInputElement).value
                  )
                }
              >
                Login
              </IonButton>
            </form>
            <div className="alt-login">
              <img
                id="googlePic"
                src={googleLogin}
                alt="google login icon"
                onClick={() => google_login()}
              />
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
    </React.Fragment>
  );
};
export default Login;
