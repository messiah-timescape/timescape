import { IonContent, IonPage, IonRouterLink } from "@ionic/react";
import React from "react";
import homepageGraphic from "../assets/homepage-graphic.png";
import "../styles/Home.scss";
import user from "../controllers/user/index";

const Home: React.FC = () => {

  let token = user.get_user();
  let output;
  token.then(function(result) {
    console.log(result ? result.email : null);
    output = result ? result.email : null;
  });
  let test = <h3>Email: {output}</h3>

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

        {test}

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
