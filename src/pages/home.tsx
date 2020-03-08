import { IonContent, IonPage, IonRouterLink, IonButton } from "@ionic/react";
import React, { useState } from "react";
import homepageGraphic from "../assets/homepage-graphic.png";
import "../styles/Home.scss";
import user from "../controllers/user/index";
import userlogout from "../controllers/user/logout";
import CheckAuth from "../helpers/CheckAuth";

const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState();
  let token = user.get_user();

  CheckAuth();

  token.then(function(result) {
    if (result) {
      setCurrentUser(result.email);
    }
  });

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

        <h3>Email: {currentUser}</h3>
        <IonButton
          onClick={() => {
            userlogout().then(() => {
              let url = window.location.href.split("/");
              url[3] = "login";
              window.location.href = url.join("/");
            });
          }}
        >
          Logout
        </IonButton>

        <img
          src={homepageGraphic}
          className="homepage-graphic"
          alt="home page graphic"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
