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
  IonTextarea,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import "../styles/Todo.scss";
import CheckAuth from "../helpers/CheckAuth";
import task_sync from "../controllers/task/task_list";
import tag_sync from "../controllers/tags/tag_list";
import {
  delete_task,
  complete_task,
  create_task,
  update_task,
} from "../controllers/task/task_actions";
import moment from "moment";
import Fade from "react-reveal/Fade";
import { UsermodelDto } from "../models/field_types";
import LoadingIcon from "../components/LoadingIcon";
// import { create_tag } from "../controllers/tags/tag_actions";
// import { Tag } from "../models/tag";
// import { TagColors } from "../models/field_types";

const Todo = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentEditTask, setCurrentEditTask]: [any, any] = useState();
  const [toDeleteId, setToDeleteId] = useState(0);
  const [tasksHTML, setTasksHTML]: [any, any] = useState();
  const [tags, setTags] = useState<any>();
  const [renderTasks, setRenderTasks] = useState(false);

  useEffect(() => {
    function syncTasks(taskList) {
      setTasksHTML(GenerateTasks(taskList));
      setRenderTasks(true);
    }

    function syncTags(tagList) {
      setTags(tagList);
    }

    CheckAuth();
    task_sync(syncTasks);
    tag_sync(syncTags);
  }, []);

  const AddEditModal = () => {
    let task = {
      order: 1,
      name: currentEditTask ? currentEditTask.name : "",
      notes: currentEditTask ? currentEditTask.notes : "",
      deadline: currentEditTask ? currentEditTask.deadline : moment(),
      tag: currentEditTask ? currentEditTask.tag : null,
    };

    function handleAdd() {
      create_task(task);
      setCurrentEditTask(null);
    }

    function handleEdit() {
      if (task.name.length > 0) {
        update_task(currentEditTask.id, task);
      }
      setCurrentEditTask(null);
    }

    function generateTagSelection() {
      let temp: any = [];

      if (tags) {
        tags.forEach((tag) => {
          let selectBoolean = false;

          if (currentEditTask) {
            if (currentEditTask.tag) {
              if (currentEditTask.tag.model.name === tag.name) {
                selectBoolean = true;
              }
            }
          }

          temp.push(
            <IonSelectOption value={tag} key={tag.id} selected={selectBoolean}>
              {tag.name}
            </IonSelectOption>
          );
        });
      }

      return temp;
    }

    return (
      <IonModal
        isOpen={true}
        onDidDismiss={() => setShowEdit(false)}
        cssClass="edit-modal"
      >
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
              onIonChange={(e) => {
                task.name = (e.target as HTMLInputElement).value;
              }}
            ></IonInput>
          </IonItem>

          <IonItem className="input-item">
            <IonSelect
              name="tags"
              id="tags-field"
              multiple={false}
              placeholder="Add Tag"
              onIonChange={(e) => {
                task.tag = new UsermodelDto(
                  (e.target as HTMLInputElement).value
                );
              }}
            >
              {generateTagSelection()}
            </IonSelect>
          </IonItem>

          <IonItem className="input-item">
            <IonTextarea
              name="notes"
              value={currentEditTask ? currentEditTask.notes : ""}
              placeholder="Add Note"
              rows={6}
              onIonChange={(e) => {
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
                  ? `${task.deadline.get("month") + 1} ${task.deadline.get(
                      "date"
                    )} ${task.deadline.get("year")}`
                  : `${
                      task.deadline.month() + 1
                    } ${task.deadline.date()} ${task.deadline.year()}`
              }
              displayFormat="MM DD YYYY"
              id="time-field"
              onIonBlur={(e) => {
                let date = (e.target as HTMLInputElement).value
                  .split("T")[0]
                  .split("-");
                task.deadline = moment(
                  `${date[1]}/${date[2]}/${date[0]}`,
                  "MM/DD/YYYY"
                );
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
            },
          },
          {
            text: "Delete",
            role: "confirm",
            cssClass: "delete-button",
            handler: () => {
              console.log("Confirm Delete", toDeleteId);
              delete_task(toDeleteId.toString());
            },
          },
        ]}
      />
    );
  };

  const GenerateTasks = (tasks) => {
    return (
      <>
        <div className="negative-z">
          <Fade>
            {tasks.map((taskGroup) => {
              return (
                <React.Fragment key={taskGroup.index + "frag"}>
                  <h3 className="date" key={taskGroup.index + "date"}>
                    {taskGroup.name}
                  </h3>

                  {taskGroup.tasks.length > 0 ? (
                    taskGroup.tasks.map((task) => {
                      return (
                        <IonItemSliding key={task.id + "tag"}>
                          <IonItem key={task.id + "item"}>
                            <div className="task" key={task.id}>
                              <div className="checkbox-div">
                                <IonCheckbox
                                  className="checkbox"
                                  onClick={() => complete_task(task.id)}
                                  checked={task.completed}
                                />
                              </div>
                              <div key={task.id + "task"}>
                                <p>{task.name}</p>
                                {task.tag ? (
                                  <p className={`tag ${task.tag.model.color}`}>
                                    {task.tag.model.name}
                                  </p>
                                ) : undefined}
                              </div>
                            </div>
                          </IonItem>
                          <IonItemOptions side="start" key={task.id + "slide"}>
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
                          <IonItemOptions
                            side="end"
                            key={task.id + "slide end"}
                          >
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
                    })
                  ) : (
                    <h4
                      className="no-tasks-here"
                      key={taskGroup.index + "status"}
                    >
                      No tasks here!
                    </h4>
                  )}
                </React.Fragment>
              );
            })}

            <button
              className="yellow-add-button"
              onClick={() => {
                setShowEdit(true);
                setCurrentEditTask(undefined);
              }}
            >
              <div className="add-icon"></div>
            </button>
          </Fade>
        </div>
      </>
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
          {renderTasks ? tasksHTML : <LoadingIcon />}
          <DeleteModal />
          {showEdit ? <AddEditModal /> : <React.Fragment />}
        </IonContent>
      </IonPage>
    </div>
  );
};
export default Todo;
