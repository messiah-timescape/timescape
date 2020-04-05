import { IonContent, IonPage, IonButton, IonGrid, IonRow, IonCol, IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonBadge } from "@ionic/react";
import React, { useState } from "react";
import breakIcon from "../assets/breakIcon.png";
import stopIcon from "../assets/stopIcon.png";
import resumeIcon from "../assets/resumeIcon.png";
import taskCompleteIcon from "../assets/taskCompleteIcon.png";
import "../styles/Home.scss";
import user from "../controllers/user/index";
import userlogout from "../controllers/user/logout";
import CheckAuth from "../helpers/CheckAuth";

const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completeTask, showCompleteTask] = useState(false);

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

  function complete() {
    showCompleteTask(true);
    toggleTimer();
    setTimeout(() => {
      showCompleteTask(false);
    }, 2000);
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
        <div className="header">
          <h2>Hi {currentUser}</h2>
          <p>How's your day going?</p>
        </div>
        {/* <IonAvatar id="profile-pic"></IonAvatar> put avatar pic here in src */}

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
          onClick={() => toggleTimer()}
          
        >Start Working</IonButton>

      </IonContent>
      <IonModal 
        isOpen={timerView}
        showBackdrop={false}
        cssClass="timer-modal"
        backdropDismiss={false}
       >
        <IonGrid className="timer-grid">
          <IonRow>
            <IonCol offset="2">
              <span className="big-numbers"><strong>00 01</strong></span> <span className="small-numbers">25</span>
            </IonCol> 
          </IonRow>
          <IonRow>
            <IonCol size="4" offset="2">
              <div className="timer-icons" onClick={() => toggleTimer()}>
                <img src={stopIcon} />
                <p id="yellow">Stop Working</p>
              </div>
            </IonCol>
            <IonCol size="5">
              <div className="timer-icons" onClick={() => pauseTimer()}>
                <img src={paused ? resumeIcon : breakIcon}></img>
                  <p id="blue">{paused ? "Back to Work" : "Take a Break"}</p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        
        <div className="current-task-section">
          <p id="current-task-section-head"><strong>Task in Progress</strong></p>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Task Title</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonBadge color="secondary">#chore</IonBadge>
            </IonCardContent>
          </IonCard>
          <IonButton id="complete-task-button" fill="outline" onClick={() => complete()}>Complete Task</IonButton>
        </div>
      </IonModal>

      <IonModal
        isOpen={completeTask}
        showBackdrop={false}
        cssClass="complete-task-modal"
        backdropDismiss={false}
      >
        <img src={taskCompleteIcon} />
        <h2>Task Complete!</h2>
      </IonModal>
    </IonPage>
  );
};

export default Home;
