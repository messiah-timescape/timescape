import { IonContent, IonPage, IonRouterLink } from "@ionic/react";
import React, { useState } from "react";
import homepageGraphic from "../assets/homepage-graphic.png";
import "../styles/Home.scss";
import user from "../controllers/user/index";

// const Display = ({ out }) => <h3>Email: {out}</h3>

const Home: React.FC = () => {
  const [currentUser, setCurrentUser] = useState();
  let token = user.get_user();
  // let output;

  token.then(function(result) {
    if (result) {
      setCurrentUser(result.email);
    }
    // result ? setCurrentUser(result.email) : null;
    // console.log(result ? result.email : null);
    // output = result ? result.email : null;
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
        {/* <Display out={output}></Display> */}

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
