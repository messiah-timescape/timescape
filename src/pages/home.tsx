import {
  IonContent,
  IonPage,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from "@ionic/react";
import React, { useState, useEffect } from "react";
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
import Fade from "react-reveal/Fade";
import task_sync from "../controllers/task/task_list";

const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completeTask, showCompleteTask] = useState(false);
  const [showSelectTask, setShowSelectTask] = useState(false);
  const [homeBG, setHomeBG] = useState(true);
  const [seconds, updateSeconds] = useState(0);
  const [tasksHTML, setTasksHTML]: [any, any] = useState();
  const [currentTask, setCurrentTask]: [any, any] = useState();
  const [minutes, updateMinutes] = useState(0);
  const [hours, updateHours] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function syncTasks(taskList) {
      setTasksHTML(GenerateTasks(taskList));
    }

    CheckAuth();
    task_sync(syncTasks);
  }, []);

  let timer_controller = get_controller().then(async ctrl => {
    if (ctrl.timer.current_task) console.log(ctrl.timer.current_task);
    if (
      !(
        ctrl.timer.current_task &&
        (ctrl.timer.current_task.model || (await ctrl.timer.current_task.promise))
      )
    ) {
      let rando_task = await (await CurrentUser.get_loggedin()).tasks.findOne();
      if (rando_task) {
        console.log("Settinsg random task");
        ctrl.set_current_task(rando_task);
      } else {
        console.log("Gonna need some tasks for this one to work");
      }
    } else {
      console.log("We have task: ", await ctrl.timer.current_task);
    }

    ctrl.link_state(duration => {
      // console.log(duration.seconds());
      // updateTimer(duration);
      // updateSeconds(duration.seconds());
      // updateMinutes(duration.minutes());
      // updateHours(duration.hours());
    });

    return ctrl;
  });

  function toggleTimer() {
    setTimerView(!timerView);
    if (!timerView) {
      timer_controller.then(ctrl => {
        ctrl.start();
      });
    } else {
      timer_controller.then(ctrl => {
        ctrl.stop();
        ctrl.unlink_state();
      });
    }
    setPaused(false); // if stop timer while on break we want to set it back to an unpaused state
    setHomeBG(!homeBG);
  }

  function pauseTimer() {
    setPaused(!paused);
    if (!paused) {
      console.log("Timer paused");

      timer_controller.then(ctrl => {
        ctrl.start_break();
      });
    } else {
      console.log("Timer resumed");

      timer_controller.then(ctrl => {
        ctrl.start();
      });
    }
  }

  function complete() {
    timer_controller.then(controller => {
      controller.unlink_state();
      showCompleteTask(true);
      setTimeout(() => {
        showCompleteTask(false);
      }, 2000);
      controller.complete_task().then(() => {
        toggleTimer();
      });
    });
  }

  const GenerateTasks = tasks => {
    return (
      <React.Fragment>
        <h1>Select a Task</h1>
        {tasks.map(taskGroup => {
          return (
            <React.Fragment key={taskGroup.index + "frag"}>
              <h3 className="date" key={taskGroup.index + "date"}>
                {taskGroup.name}
              </h3>

              {taskGroup.tasks.length > 0 ? (
                taskGroup.tasks.map(task => {
                  return (
                    <IonCard
                      key={task.id + "item"}
                      onClick={() => {
                        setLoading(true);
                        timer_controller
                          .then(controller => controller.set_current_task(task))
                          .then(() => {
                            setShowSelectTask(false);
                            toggleTimer();
                            setCurrentTask(task);
                            setLoading(false);
                          });
                      }}
                    >
                      <div className="select-task" key={task.id}>
                        <div key={task.id + "task"}>
                          <p>{task.name}</p>
                          {task.tag ? (
                            <p className={`tag ${task.tag.model.color}`}>{task.tag.model.name}</p>
                          ) : (
                            undefined
                          )}
                        </div>
                      </div>
                    </IonCard>
                  );
                })
              ) : (
                <React.Fragment />
              )}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  };

  const SelectTaskModal = () => {
    return <IonContent className="ion-padding">{loading ? <LoadingIcon /> : tasksHTML}</IonContent>;
  };

  const LoadingIcon = () => {
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  };

  const [currentUser, setCurrentUser] = useState(String);
  let token = user.get_loggedin();

  CheckAuth();

  token.then(function(result) {
    if (result) {
      setCurrentUser(result.display_name || result.email);
    }
  });

  return (
    <React.Fragment>
      <IonPage>
        <IonContent className="ion-padding" id={homeBG ? "home-page" : ""}>
          {showSelectTask ? <SelectTaskModal /> : undefined}
          <Fade top>
            <div className="header">
              <h2>Hi {currentUser}</h2>
              <p>How's your day going?</p>
            </div>
            {/* <IonAvatar id="profile-pic"></IonAvatar> put avatar pic here in src */}

            <IonButton
              hidden={timerView}
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
          </Fade>
          <IonButton
            id="start-timer"
            expand="block"
            size="large"
            hidden={timerView}
            onClick={() => {
              setShowSelectTask(true);
            }}
          >
            Start Working
          </IonButton>
        </IonContent>

        <IonModal
          isOpen={timerView}
          showBackdrop={false}
          cssClass="timer-view"
          backdropDismiss={false}
        >
          <IonGrid className="timer-grid">
            <IonRow>
              <IonCol offset="2">
                <IonGrid>
                  <IonRow>
                    <IonCol size="4" offset="0">
                      <strong className="big-numbers">{hours.toString().padStart(2, "0")}</strong>
                    </IonCol>
                    <IonCol size="4">
                      <strong className="big-numbers">{minutes.toString().padStart(2, "0")}</strong>
                    </IonCol>
                    <IonCol size="4" className="small-numbers">
                      <span>{seconds.toString().padStart(2, "0")}</span>
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
            <p id="current-task-section-head">
              <strong>Task in Progress</strong>
            </p>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{currentTask ? currentTask.name : undefined}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {currentTask ? (
                  <p className={`tag ${currentTask.tag ? currentTask.tag.model.color : undefined}`}>
                    {currentTask.tag ? currentTask.tag.model.name : undefined}
                  </p>
                ) : (
                  undefined
                )}
              </IonCardContent>
            </IonCard>
            <IonButton id="complete-task-button" fill="outline" onClick={() => complete()}>
              Complete Task
            </IonButton>
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
    </React.Fragment>
  );
};

export default Home;
