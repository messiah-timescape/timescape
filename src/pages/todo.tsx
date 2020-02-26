import { IonContent, IonPage, IonRouterLink, IonButton } from "@ionic/react";
import React from "react";
import "../styles/Todo.scss";

const AddButton = () => {
  return <div></div>;
};

const Todo: React.FC = () => {
  return (
    <React.Fragment>
      <IonPage>
        <IonContent className="ion-padding">
          <h1>To-Do</h1>
          <div className="nothing-here">
            <div className="hourglass" />
            <p>You're all caught up!</p>
            <p>Add a task to get started.</p>
          </div>
          {/* <div className="yellow-add-button"></div> */}
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
