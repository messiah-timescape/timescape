import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonRouterLink
} from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import topImage from "../assets/loginPageTop.png";
import "../styles/Register.scss";
import googleLogin from "../assets/googleLogin.png";
import { usersignup } from "../controllers/user/signup";
import { userlogin_google_oauth } from "../controllers/user/login";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [showFailedLogin, setShowFailedLogin] = useState(false);

  function google_login() {
    userlogin_google_oauth().then(res => {
      console.log(res.new);
      let url = window.location.href.split("/");
      url[3] = "survey";
      window.location.href = url.join("/");
    });
  }

  function handleSubmitSignUp(email_input: string, password_input: string) {
    usersignup({ email: email_input, password: password_input }).then(
      successfulRegister,
      failedRegister
    );

    function successfulRegister() {
      setShowFailedLogin(false);
      let url = window.location.href.split("/");
      url[3] = "home";
      window.location.href = url.join("/");
    }

    function failedRegister() {
      setShowFailedLogin(true);
    }
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      handleSubmitSignUp(
        (document.getElementById("email-field") as HTMLInputElement).value,
        (document.getElementById("password-field") as HTMLInputElement).value
      );
    }
  }

  return (
    <React.Fragment>
      <IonContent class="ion-padding">
        <img id="top-border" src={topImage} alt="login" />
        <div className="div-content">
          <h1>Register</h1>

          <form className="form-register">
            <IonItem className="input">
              <IonInput
                name="email"
                placeholder="Email"
                id="email-field"
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
                type={showPassword ? "text" : "password"}
                id="password-field"
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
            {showFailedLogin ? (
              <p className="wrong-password-text">Email already registered.</p>
            ) : (
              <p></p>
            )}
            <IonButton
              className="button"
              onClick={() =>
                handleSubmitSignUp(
                  (document.getElementById("email-field") as HTMLInputElement)
                    .value,
                  (document.getElementById(
                    "password-field"
                  ) as HTMLInputElement).value
                )
              }
            >
              Register
            </IonButton>

            <IonRouterLink href="/login">
              <p className="link-text">Cancel</p>
            </IonRouterLink>
          </form>

          <div className="alt-register">
            <div>
              <img
                id="googlePic"
                src={googleLogin}
                alt="google login icon"
                onClick={() => google_login()}
              />
            </div>
            <p>
              Already have an account?
              <br />
              <IonRouterLink href="/login" className="link-text">
                Login
              </IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </React.Fragment>
  );
};
export default Register;
