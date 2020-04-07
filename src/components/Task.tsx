import React from "react";
import { IonCheckbox, IonItemSliding, IonItem, IonItemOptions } from "@ionic/react";
import {
  delete_task,
  complete_task,
  create_task,
  update_task
} from "../controllers/task/task_actions";

const Task = ({ task, setCurrentEditTask, setShowEdit, setShowDelete, setToDeleteId }) => {
  let tagClass = "";

  return (
    <IonItemSliding key={task.id + "tag"}>
      <IonItem>
        <div className="task" key={task.id}>
          <div className="checkbox-div">
            <IonCheckbox
              className="checkbox"
              onClick={() => complete_task(task.id)}
              checked={task.completed}
            />
          </div>
          <div>
            <p>{task.name}</p>
            <p className={tagClass}>{task.tag ? task.tag : undefined}</p>
          </div>
        </div>
      </IonItem>
      <IonItemOptions side="start">
        <button className="add-button">
          <div className="add-mask"></div>
        </button>
        <button
          className="edit-button"
          onClick={() => {
            setCurrentEditTask(task);
            setShowEdit(true);
          }}
        >
          <div className="edit-mask"></div>
        </button>
      </IonItemOptions>
      <IonItemOptions side="end">
        <button
          className="delete-button"
          onClick={() => {
            setShowDelete(true);
            setToDeleteId(task.id);
          }}
        >
          <div className="delete-mask"></div>
        </button>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default Task;
