import {
  IonContent,
  IonPage,
  IonRouterLink,
  IonCheckbox,
  IonCard
} from "@ionic/react";
import React, { useState } from "react";
import "../styles/Todo.scss";

const Todo: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const sampleTasks = [
    { title: "CIS 412 Sprint 1", tag: "#homework", color: "red" },
    { title: "Have Ethan make coffee", tag: "#fun", color: "blue" },
    {
      title:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
      tag: "#assignment",
      color: "green"
    },
    { title: "Ethan Wong", tag: "#timescape", color: "purple" }
  ];

  const Task = () => {
    let temp: any = [];

    sampleTasks.forEach(task => {
      let tagClass = "tag " + task.color;

      temp.push(
        <div className="task" key={task.title + task.tag}>
          <div className="checkbox-div">
            <IonCheckbox className="checkbox" />
          </div>
          <div>
            <p>{task.title}</p>
            <p className={tagClass}>{task.tag}</p>
          </div>
        </div>
      );
    });

    return <React.Fragment>{temp}</React.Fragment>;
  };

  //Get all tasks > Promise returns the list of items

  return (
    <div className="todo-parent-div">
      <IonPage>
        <div className="header-div-parent">
          <div className="header-div">
            <h1 className="todo-header">To-Do</h1>
          </div>
        </div>
        <div className="ion-card-div">
          <IonCard>
            <div className="angle-down"></div>
          </IonCard>
        </div>

        <IonContent className="ion-padding">
          <h3 className="date">Today</h3>
          {tasks.length == 0 ? <Task /> : <React.Fragment></React.Fragment>}
          <IonRouterLink routerLink="/addtask">
            <button className="yellow-add-button">
              <div className="add-icon"></div>
            </button>
          </IonRouterLink>
        </IonContent>
      </IonPage>
    </div>
  );
};
export default Todo;
