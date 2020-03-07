import {
  IonContent,
  IonPage,
  IonRouterLink,
  IonCheckbox,
  IonItemSliding,
  IonItem,
  IonItemOptions
} from "@ionic/react";
import React, { useState } from "react";
import "../styles/Todo.scss";
import CheckAuth from "../helpers/CheckAuth";

const Todo: React.FC = () => {
  CheckAuth();
  const [tasks] = useState([]);
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
        <IonItemSliding key={task.title + task.tag}>
          <IonItem>
            <div className="task" key={task.title + task.tag + task.color}>
              <div className="checkbox-div">
                <IonCheckbox className="checkbox" />
              </div>
              <div>
                <p>{task.title}</p>
                <p className={tagClass}>{task.tag}</p>
              </div>
            </div>
          </IonItem>
          <IonItemOptions side="start">
            <button className="add-button">
              <div className="add-mask"></div>
            </button>
            <button className="edit-button">
              <div className="edit-mask"></div>
            </button>
          </IonItemOptions>
          <IonItemOptions side="end">
            <button className="delete-button">
              <div className="delete-mask"></div>
            </button>
          </IonItemOptions>
        </IonItemSliding>
      );
    });

    return <React.Fragment>{temp}</React.Fragment>;
  };

  return (
    <div className="todo-parent-div">
      <IonPage>
        <div className="header-div-parent">
          <div className="header-div">
            <h1 className="todo-header">To-Do</h1>
          </div>
        </div>

        <IonContent>
          <h3 className="date">Today</h3>
          <div className="negative-z">
            {tasks.length === 0 ? <Task /> : <React.Fragment></React.Fragment>}
            <IonRouterLink routerLink="/addtask">
              <button className="yellow-add-button">
                <div className="add-icon"></div>
              </button>
            </IonRouterLink>
            <h3 className="date">Tomorrow</h3>
            {tasks.length === 0 ? <Task /> : <React.Fragment></React.Fragment>}
          </div>
        </IonContent>
      </IonPage>
    </div>
  );
};
export default Todo;
