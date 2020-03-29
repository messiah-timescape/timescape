import {
  IonContent,
  IonPage,
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
import React, { useState, useEffect } from "react";
import "../styles/Todo.scss";
import CheckAuth from "../helpers/CheckAuth";
import task_sync from "../controllers/task/task_list";
import {
  delete_task,
  complete_task,
  create_task,
  update_task
} from "../controllers/task/task_actions";
import moment from "moment";

const Todo = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState();
  const [toDeleteId, setToDeleteId] = useState(0);
  const [tasks, setTasks] = useState();
  const [renderTasks, setRenderTasks] = useState(false);

  useEffect(() => {
    CheckAuth();
    task_sync(syncTasks);
  }, []);

  function syncTasks(taskList) {
    setTasks(taskList);
    setRenderTasks(false);
    setRenderTasks(true);
  }

  const AddEditModal = () => {
    let task = {
      order: 1,
      name: currentEditTask ? currentEditTask.name : "",
      notes: currentEditTask ? currentEditTask.notes : "",
      deadline: currentEditTask ? currentEditTask.deadline : moment()
    };

    function handleAdd() {
      create_task(task);
      setCurrentEditTask(null);
    }

    function handleEdit() {
      console.log(task, "handle edit");

      if (task.name.length > 0) {
        update_task(currentEditTask.id, task);
      }
      setCurrentEditTask(null);
    }

    return (
      <IonModal isOpen={true} onDidDismiss={() => setShowEdit(false)} cssClass="edit-modal">
        <IonContent className="ion-padding">
          <div className="modal-buttons">
            <p
              className="cancel-button"
              onClick={() => {
                setShowEdit(false);
              }}
            >
              Cancel
            </p>
            <p
              className="save-button"
              onClick={() => {
                setShowEdit(false);
                currentEditTask ? handleEdit() : handleAdd();
              }}
            >
              Save
            </p>
          </div>

          <IonItem className="input-item">
            <IonInput
              name="title"
              placeholder="Add Title"
              value={currentEditTask ? currentEditTask.name : ""}
              id="title-field"
              required
              onIonChange={e => {
                task.name = (e.target as HTMLInputElement).value;
              }}
            ></IonInput>
          </IonItem>

          <IonItem className="input-item">
            <IonSelect name="tags" id="tags-field" multiple={false} placeholder="Add Tag">
              {" "}
              {/*change multiple to true to allow user to choose more than one tag */}
              <IonSelectOption value="school">School</IonSelectOption>
              <IonSelectOption value="chore">Chore</IonSelectOption>
              <IonSelectOption value="work">Work</IonSelectOption>
              <IonSelectOption value="hobbie">Hobby</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="input-item">
            <IonTextarea
              name="notes"
              value={currentEditTask ? currentEditTask.notes : ""}
              placeholder="Add Note"
              rows={6}
              onIonChange={e => {
                task.notes = (e.target as HTMLInputElement).value;
              }}
            ></IonTextarea>
          </IonItem>

          <IonItem className="input-item">
            <p>Due:</p>
            <IonDatetime
              name="time"
              value={
                currentEditTask
                  ? `${currentEditTask.deadline.get("month") + 1} ${currentEditTask.deadline.get(
                      "date"
                    )} ${currentEditTask.deadline.get("year")}`
                  : "02 12 2020"
              }
              displayFormat="MM DD YYYY"
              id="time-field"
              onIonBlur={e => {
                let date = (e.target as HTMLInputElement).value.split("T")[0].split("-");
                task.deadline = moment(`${date[1]}/${date[2]}/${date[0]}`, "MM/DD/YYYY");
                console.log(task.deadline);
              }}
              placeholder="Add Due Date"
              slot="end"
            ></IonDatetime>
          </IonItem>
        </IonContent>
      </IonModal>
    );
  };

  const DeleteModal = () => {
    return (
      <IonAlert
        isOpen={showDelete}
        cssClass="delete-alert"
        onDidDismiss={() => setShowDelete(false)}
        message={"Are you sure you want to delete this task?"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "cancel-button",
            handler: () => {
              console.log("Confirm Cancel");
            }
          },
          {
            text: "Delete",
            role: "confirm",
            cssClass: "delete-button",
            handler: () => {
              console.log("Confirm Delete", toDeleteId);
              delete_task(toDeleteId.toString());
            }
          }
        ]}
      />
    );
  };

  const GenerateTasks = () => {
    let temp: any = [];

    if (!tasks) {
      return <React.Fragment>False</React.Fragment>;
    }

    tasks.forEach(taskGroup => {
      temp.push(
        <h3 className="date" key={taskGroup.index + "date"}>
          {taskGroup.name}
        </h3>
      );

      if (taskGroup.tasks.length > 0) {
        taskGroup.tasks.forEach(task => {
          let tagClass = "";

          switch (task.tag) {
            case "School":
              tagClass = "tag red";
              break;
            case "Chore":
              tagClass = "tag blue";
              break;
            case "Work":
              tagClass = "tag green";
              break;
            case "Hobby":
              tagClass = "tag purple";
              break;
          }

          temp.push(
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
        });
      } else {
        temp.push(
          <h4 className="no-tasks-here" key={taskGroup.index + "status"}>
            No tasks here!
          </h4>
        );
      }
    });

    return (
      <div className="negative-z">
        {temp}
        <button
          className="yellow-add-button"
          onClick={() => {
            setShowEdit(true);
          }}
        >
          <div className="add-icon"></div>
        </button>
      </div>
    );
  };

  const LoadingScreen = () => {
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
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
          {renderTasks ? <GenerateTasks /> : <LoadingScreen />}

          <DeleteModal />
          {showEdit ? <AddEditModal /> : <React.Fragment />}
        </IonContent>
      </IonPage>
    </div>
  );
};
export default Todo;
