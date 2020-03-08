import {
  IonContent,
  IonPage,
  IonRouterLink,
  IonCheckbox,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonAlert, 
  IonModal, 
  IonInput, 
  IonDatetime, 
  IonSelectOption,
  IonSelect, 
  IonTextarea
} from "@ionic/react";
import React, { useState } from "react";
import "../styles/Todo.scss";
import CheckAuth from "../helpers/CheckAuth";

const Todo: React.FC = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTag, setModalTag] = useState("");


  function populateEdit(title: string, tag: string) {
    setModalTitle(title);
    setModalTag(tag);
    setShowEdit(true);
  }

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
            <button className="edit-button" onClick={() => {populateEdit(task.title, task.tag)}}>
              <div className="edit-mask"></div>
            </button>
          </IonItemOptions>
          <IonItemOptions side="end">
            <button className="delete-button" onClick={() => {setShowDelete(true)}}>
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

          <IonAlert isOpen={showDelete} cssClass="delete-alert"
            onDidDismiss={() => setShowDelete(false)}
            message={'Are you sure you want to delete this task?'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'cancel-button',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              },
              {
                text: 'Delete',
                role: 'confirm',
                cssClass: 'delete-button',
                handler: () => {
                  console.log('Confirm Delete');
                }
              }
            ]}
          />

          <IonModal isOpen={showEdit} onDidDismiss={() => setShowEdit(false)} cssClass="edit-modal">
            <IonContent className="ion-padding">
              <p className="save-button" onClick={() => {setShowEdit(false)}}>save</p>
              <IonItem className="input-item">
                <IonInput 
                  name="title" 
                  value="Play videogames with Matt" 
                  id="title-field" 
                  required></IonInput>
              </IonItem>

              <IonItem className="input-item">
                <IonSelect 
                  name="tags"
                  value={['school', 'hobbie']}
                  id="tags-field" 
                  multiple={true}>
                  <IonSelectOption value="school">School</IonSelectOption>
                  <IonSelectOption value="chore">Chore</IonSelectOption>
                  <IonSelectOption value="work">Work</IonSelectOption>
                  <IonSelectOption value="hobbie">Hobbie</IonSelectOption>
                </IonSelect>
            </IonItem>

            <IonItem className="input-item">
              <IonTextarea 
                name="notes"
                value="Don't read the notes section, I didn't take any notes."
                rows={6}></IonTextarea>
            </IonItem>

            <IonItem className="input-item">
              <IonDatetime 
                name="time"
                value="02 12 2020"
                displayFormat="MM DD YYYY" 
                id="time-field">
                </IonDatetime>
            </IonItem>

            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    </div>

  );
};
export default Todo;
