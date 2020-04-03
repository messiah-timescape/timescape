import { IonContent, IonPage, IonButton, IonGrid, IonRow, IonCol } from "@ionic/react";
import React, { useState } from "react";
// import homepageGraphic from "../assets/homepage-graphic.png";
import pauseIcon from "../assets/pauseIcon.png";
import stopIcon from "../assets/stopIcon.png";
import resumeIcon from "../assets/resumeIcon.png";
import "../styles/Home.scss";
import user from "../controllers/user/index";
import userlogout from "../controllers/user/logout";
import CheckAuth from "../helpers/CheckAuth";

const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);

  function toggleTimer() {
    setTimerView(!timerView);
    if (!timerView) {
      console.log("Timer switched on.");
    } else {
      console.log("Timer switched off.");
      if (paused) {
        console.log("Timer Resumed");
      }
    }
    setPaused(false); // if stop timer while on break we want to set it back to an unpaused state
  }

  function pauseTimer() {
    setPaused(!paused);
    if (!paused) {
      console.log("Timer paused");
    } else {
      console.log("Timer resumed");
    }
  }

  const [currentUser, setCurrentUser] = useState();
  let token = user.get_user();

  CheckAuth();

  token.then(function(result) {
    if (result) {
      setCurrentUser(result.display_name || result.email);
    }
  });

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Home</h1>

        <h3>Welcome, {currentUser}</h3>
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

        <IonButton
          id="start-timer"
          expand="block"
          size="large"
          hidden= {timerView}
          onClick={() => toggleTimer()}
          
        >Start Working</IonButton>

        <IonGrid hidden={!timerView}>
          <IonRow>
            <IonCol offset="2">
              <p id="timer-numbers">00 : 00 : 00</p>
            </IonCol> 
          </IonRow>
          <IonRow>
            <IonCol size="5" offset="1">
              <div 
              className="active-timer-button" 
              id="stop-timer"
              onClick={() => toggleTimer()}
              >
                <img src={stopIcon} />
                <p>Stop Working</p>
              </div>
            </IonCol>
            <IonCol size="5">
              <div 
              className="active-timer-button" 
              id="pause-timer"
              onClick={() => pauseTimer()}
              >
                <img src={paused ? resumeIcon : pauseIcon} />
                <p>{paused ? "Continue Working" : "Take a Break"}</p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* <img src={homepageGraphic} className="homepage-graphic" alt="home page graphic" /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
