import {
  IonContent,
  IonPage,
  IonRouterLink,
  IonCheckbox,
  IonHeader
} from "@ionic/react";
import React from "react";
import "../styles/Todo.scss";

const Task = ({ taskTitle, tag, tagColor }) => {
  let tagClass = "tag " + tagColor;

  return (
    <React.Fragment>
      <div className="task">
        <div className="checkbox-div">
          <IonCheckbox className="checkbox" />
        </div>
        <div>
          <p>{taskTitle}</p>
          <p className={tagClass}>{tag}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

const Todo: React.FC = () => {
  return (
    <React.Fragment>
      <IonPage>
        <IonHeader className="ion-padding">
          <h1>To-Do</h1>
        </IonHeader>
        <IonContent className="ion-padding">
          <h3 className="date">Today</h3>
          <Task
            taskTitle={"CIS 412 Sprint 1"}
            tag={"#homework"}
            tagColor={"red"}
          />
          <Task
            taskTitle={"Have Ethan make coffee"}
            tag={"#fun"}
            tagColor={"blue"}
          />
          <Task
            taskTitle={
              "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore"
            }
            tag={"#assignment"}
            tagColor={"green"}
          />
          <Task
            taskTitle={"Ethan Wong"}
            tag={"#timescape"}
            tagColor={"purple"}
          />

          {/* <div className="nothing-here">
            <div className="hourglass" />
            <p>You're all caught up!</p>
            <p>Add a task to get started.</p>
          </div> */}
          <IonRouterLink routerLink="/addtask">
            <button className="yellow-add-button">
              <div className="add-icon"></div>
            </button>
          </IonRouterLink>
        </IonContent>
      </IonPage>
    </React.Fragment>
  );
};
export default Todo;
