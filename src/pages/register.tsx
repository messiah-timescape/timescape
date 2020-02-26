import { IonContent, IonInput, IonItem, IonButton, IonIcon, IonRouterLink } from "@ionic/react";
import { eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import topImage from "../assets/loginPageTop.png";
import bottomImage from "../assets/loginPageBottom.png";
import "../styles/Register.scss";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(eye);

  return (
    <React.Fragment>
      <IonContent class="ion-padding">
        <div className="div-content">
          <h1>Register</h1>

          <form>
            <IonItem className="input">
              <IonInput name="user" placeholder="Username" required></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput name="user" placeholder="Email" required></IonInput>
            </IonItem>
            <IonItem className="input">
              <IonInput
                name="password"
                placeholder="Password"
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

            <IonButton className="button" type="submit">
              Register
            </IonButton>
            <IonRouterLink href="/login">
              <p className="link-text">Cancel</p>
            </IonRouterLink>
          </form>

          <div className="alt-register">
            <p>
              Already have an account?
              <br />
              <span className="link-text">Login</span>
            </p>
          </div>
        </div>
      </IonContent>
      <img id="top-border" src={topImage} />
      <img id="bot-border" src={bottomImage} />
    </React.Fragment>
  );
};
export default Login;
