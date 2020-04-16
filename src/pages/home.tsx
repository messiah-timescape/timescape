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
  IonCardContent,
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
import Fade from "react-reveal/Fade";
import task_sync from "../controllers/task/task_list";

let timer_controller;
const Home: React.FC = () => {
  const [timerView, setTimerView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completeTask, showCompleteTask] = useState(false);
  const [showSelectTask, setShowSelectTask] = useState(false);
  const [seconds, updateSeconds] = useState(0);
  const [tasksHTML, setTasksHTML]: [any, any] = useState();
  const [currentTask, setCurrentTask]: [any, any] = useState();
  const [minutes, updateMinutes] = useState(0);
  const [hours, updateHours] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncTasks = (taskList) => {
      setTasksHTML(GenerateTasks(taskList));
    };

    CheckAuth();
    task_sync((tasks) => {
      syncTasks(tasks);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!timer_controller)
      timer_controller = get_controller(state_setter).then(async (ctrl) => {
        if (ctrl.timer.is_started()) {
          await ctrl.timer.current_task!.promise;
          if (ctrl.timer.current_task!.model!.tag)
            await ctrl.timer.current_task!.model!.tag.promise;
          setCurrentTask(ctrl.timer.current_task!.model);

          setTimerView(true);
          ctrl.start_counter();
        }
        return ctrl;
      });

    // return () => {
    //   timer_controller.then( async ctrl => {
    //     ctrl.stop_counter()
    //   } )
    // };
  }, []);

  function state_setter(duration) {
    updateSeconds(duration.seconds());
    updateMinutes(duration.minutes());
    updateHours(duration.hours());
  }

  function toggleTimer() {
    if (timer_controller) {
      setTimerView(!timerView);
      if (!timerView) {
        timer_controller.then((ctrl) => {
          ctrl.start();
        });
      } else {
        timer_controller.then((ctrl) => {
          ctrl.stop();
        });
      }
      setPaused(false); // if stop timer while on break we want to set it back to an unpaused state
    }
  }

  function pauseTimer() {
    if (timer_controller) {
      setPaused(!paused);
      if (!paused) {
        console.log("Timer paused");

        timer_controller.then((ctrl) => {
          ctrl.start_break();
        });
      } else {
        console.log("Timer resumed");

        timer_controller.then((ctrl) => {
          ctrl.start();
        });
      }
    }
  }

  function complete() {
    if (timer_controller) {
      timer_controller.then((controller) => {
        showCompleteTask(true);
        setTimeout(() => {
          showCompleteTask(false);
        }, 2000);
        controller.complete_task().then(() => {
          setTimerView(false);
        });
      });
    }
  }

  const GenerateTasks = (tasks) => {
    return (
      <React.Fragment>
        <h1>Select a Task</h1>
        {tasks.map((taskGroup) => {
          return (
            <React.Fragment key={taskGroup.index + "frag"}>
              <h3 className="date" key={taskGroup.index + "date"}>
                {taskGroup.name}
              </h3>

              {taskGroup.tasks.length > 0 ? (
                taskGroup.tasks.map((task) => {
                  return (
                    <IonCard
                      key={task.id + "item"}
                      onClick={() => {
                        if (timer_controller) {
                          setLoading(true);
                          timer_controller
                            .then((controller) =>
                              controller.set_current_task(task)
                            )
                            .then(() => {
                              setShowSelectTask(false);
                              toggleTimer();
                              setCurrentTask(task);
                              setLoading(false);
                            });
                        }
                      }}
                    >
                      <div className="select-task" key={task.id}>
                        <div key={task.id + "task"}>
                          <p>{task.name}</p>
                          {task.tag ? (
                            <p className={`tag ${task.tag.model.color}`}>
                              {task.tag.model.name}
                            </p>
                          ) : undefined}
                        </div>
                      </div>
                    </IonCard>
                  );
                })
              ) : (
                <h4 className="no-tasks-here" key={taskGroup.index + "status"}>
                  No tasks here!
                </h4>
              )}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  };

  const SelectTaskModal = () => {
    return (
      <IonContent className="select-modal">
        {loading ? <LoadingIcon /> : tasksHTML}

        <IonButton
          id="cancel-timer"
          fill="outline"
          hidden={!showSelectTask}
          onClick={() => {
            setShowSelectTask(false);
          }}
        >
          Cancel
        </IonButton>
      </IonContent>
    );
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

  token.then(function (result) {
    if (result) {
      setCurrentUser(result.display_name || result.email);
    }
  });

  return (
    <React.Fragment>
      <IonPage>
        <IonContent className="ion-padding" id={!timerView ? "home-page" : ""}>
          {showSelectTask ? <SelectTaskModal /> : undefined}
          <Fade top>
            <div className="header" hidden={timerView || showSelectTask}>
              <h2>Hi {currentUser}</h2>
              <p>How's your day going?</p>
            </div>
            {/* <IonAvatar id="profile-pic"></IonAvatar> put avatar pic here in src */}

            <IonButton
              hidden={timerView || showSelectTask}
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
            hidden={timerView || showSelectTask}
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
                      <strong className="big-numbers">
                        {hours.toString().padStart(2, "0")}
                      </strong>
                    </IonCol>
                    <IonCol size="4">
                      <strong className="big-numbers">
                        {minutes.toString().padStart(2, "0")}
                      </strong>
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
                  <img src={stopIcon} alt="" />
                  <p id="yellow">Stop Working</p>
                </div>
              </IonCol>
              <IonCol size="5">
                <div className="timer-icons" onClick={() => pauseTimer()}>
                  <img src={paused ? resumeIcon : breakIcon} alt=""></img>
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
                <IonCardTitle>
                  {currentTask ? currentTask.name : "No task set?"}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {currentTask ? (
                  <p
                    className={`tag ${
                      currentTask.tag ? currentTask.tag.model.color : undefined
                    }`}
                  >
                    {currentTask.tag ? currentTask.tag.model.name : undefined}
                  </p>
                ) : undefined}
              </IonCardContent>
            </IonCard>
            <IonButton
              id="complete-task-button"
              fill="outline"
              onClick={() => complete()}
            >
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
          <div className="complete-task-div">
            <img src={taskCompleteIcon} alt="" />
            <h2>Task Complete!</h2>
          </div>
        </IonModal>
      </IonPage>
    </React.Fragment>
  );
};

export default Home;
