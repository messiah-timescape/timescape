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
import { get_controller } from "../controllers/timer/control_timer";
import CurrentUser from "../controllers/user/index";

const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);

  let timer_controller = get_controller().then( async ctrl => {
    if (!(ctrl.timer.current_task && (await ctrl.timer.current_task.promise))) {
      let rando_task = await ((await CurrentUser.get_loggedin()).tasks.findOne());
      if ( rando_task ) {
        console.log("Setting random task")
        ctrl.set_current_task( rando_task );
      } else {
        console.log("Gonna need some tasks for this one to work");
      }
    } else {
      console.log("We have task: ", await ctrl.timer.current_task)
    }
    
    return ctrl;
  } );
  function toggleTimer() {
    setTimerView(!timerView);
    if (!timerView) {
      timer_controller.then(( ctrl )=>{
        ctrl.start();
      });
    } else {
      if (paused) {
        timer_controller.then(( ctrl )=>{
          ctrl.start();
        });
        console.log("Timer Resumed");
      } else {
        console.log("Timer switched off.");
        timer_controller.then(( ctrl )=>{
          ctrl.stop();
        });
      }
    }
    setPaused(false); // if stop timer while on break we want to set it back to an unpaused state
  }

  function pauseTimer() {
    setPaused(!paused);
    if (!paused) {
      console.log("Timer paused");

      timer_controller.then(( ctrl )=>{
        ctrl.start_break();
      });
    } else {
      console.log("Timer resumed");

      timer_controller.then(( ctrl )=>{
        ctrl.start();
      });
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
