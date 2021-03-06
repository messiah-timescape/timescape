import { IonContent, IonInput, IonItem, IonButton, IonIcon, IonRouterLink } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import topImage from "../assets/loginPageTop.png";
import "../styles/Register.scss";
import googleIcon from "../assets/googleIcon.png";
import { usersignup } from "../controllers/user/signup";
import { userlogin_google_oauth } from "../controllers/user/login";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [showFailedLogin, setShowFailedLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function google_login() {
    userlogin_google_oauth().then(res => {
      let url = window.location.href.split("/");
      url[3] = "survey";
      window.location.href = url.join("/");
    });
  }

  function handleSubmitSignUp(name_input: string, email_input: string, password_input: string) {
    setLoading(true);
    usersignup({
      display_name: name_input,
      email: email_input,
      password: password_input
    }).then(
      successfulRegister,
      failedRegister
    );

    function successfulRegister() {
      setShowFailedLogin(false);
      let url = window.location.href.split("/");
      url[3] = "survey";
      window.location.href = url.join("/");
    }

    function failedRegister(e) {
      setErrorMessage(e.message);
      setLoading(false);
      setShowFailedLogin(true);
    }
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      submit_form();
    }
  }

  function submit_form() {
    handleSubmitSignUp(
      (document.getElementById("name-field") as HTMLInputElement).value,
      (document.getElementById("email-field") as HTMLInputElement).value,
      (document.getElementById("password-field") as HTMLInputElement).value
    );
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
                name="name"
                placeholder="Name"
                id="name-field"
                required
                onKeyDown={e => {
                  handleKeyDown(e);
                }}
              ></IonInput>
            </IonItem>
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
            {showFailedLogin ? <p className="wrong-password-text">{errorMessage}</p> : <p></p>}

            {loading ? (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <IonButton
                className="button"
                onClick={submit_form}
              >
                Register
              </IonButton>
            )}

            <IonRouterLink href="/login">
              <p>Cancel</p>
            </IonRouterLink>
          </form>

          <div className="alt-register">
            <button onClick={() => google_login()}>
              <img id="googlePic" src={googleIcon} alt="google login icon" />
              <p>Register with Google</p>
            </button>

            <p>
              Already have an account?
              <br />
              <IonRouterLink href="/login">Login</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </React.Fragment>
  );
};
export default Register;
