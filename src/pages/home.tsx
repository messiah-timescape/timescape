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
import { get_controller } from "../controllers/timer/control_timer";
import CurrentUser from "../controllers/user/index";

const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completeTask, showCompleteTask] = useState(false);
  //const [time, updateTime] = useState(moment({hour: 0, minute: 0, seconds: 0}));
  const [seconds, updateSeconds] = useState(0);
  const [minutes, updateMinutes] = useState(0);
  const [hours, updateHours] = useState(0);

  console.log("hi");

  let timer_controller = get_controller().then( async ctrl => {
    if(ctrl.timer.current_task)
      console.log(ctrl.timer.current_task);
    if (!(ctrl.timer.current_task && (ctrl.timer.current_task.model || await ctrl.timer.current_task.promise))) {
      let rando_task = await ((await CurrentUser.get_loggedin()).tasks.findOne());
      if ( rando_task ) {
        console.log("Settinsg random task")
        ctrl.set_current_task( rando_task );
      } else {
        console.log("Gonna need some tasks for this one to work");
      }
    } else {
      console.log("We have task: ", await ctrl.timer.current_task)
    }
    
    ctrl.link_state(duration => {
      // updateSeconds(duration.seconds());
      // updateMinutes(duration.minutes());
      // updateHours(duration.hours());
    
    });

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

  function complete() {
    showCompleteTask(true);
    toggleTimer();
    setTimeout(() => {
      showCompleteTask(false);
    }, 2000);
  }

  const [currentUser, setCurrentUser] = useState(String);
  let token = user.get_user();

  CheckAuth();

  token.then(function(result) {
    if (result) {
      setCurrentUser(result.display_name || result.email);
    }
  });

  return (
    <IonPage>
      <IonContent className="ion-padding" id="home-page">
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
              <IonGrid>
                <IonRow>
                  <IonCol size="3" offset="1">
                    <strong className="big-numbers">{hours}</strong>
                  </IonCol>
                  <IonCol size="3">
                    <strong className="big-numbers">{minutes}</strong>
                  </IonCol>
                  <IonCol size="3"className="small-numbers" >
                    <span>{seconds}</span>
                  </IonCol>
                </IonRow>
              </IonGrid>
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
