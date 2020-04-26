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
import { UsermodelDto, TagColors } from "../models/field_types";
import { create_tag } from "../controllers/tags/tag_actions";
import { Tag, Task } from "../models";
import { colorFill } from "ionicons/icons";

const Todo = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [currentEditTask, setCurrentEditTask]: [Partial<Task> | undefined, any] = useState();
  const [toDeleteId, setToDeleteId] = useState(0);
  const [tasksHTML, setTasksHTML]: [any, any] = useState();
  const [tags, setTags] = useState<any>();
  const [renderTasks, setRenderTasks] = useState(false);
  const [new_tag_model_open, setShow_new_tag_model]:[boolean, Function] = useState<boolean>(false);

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
    let task:Partial<Task> = {
      id: currentEditTask ? currentEditTask.id : undefined,
      order: 1,
      name: currentEditTask ? currentEditTask.name : "",
      notes: currentEditTask ? currentEditTask.notes : "",
      deadline: currentEditTask ? currentEditTask.deadline : moment(),
      tag: currentEditTask ? currentEditTask.tag : undefined,
    };

    function handleAdd() {
      if ( task ) {
        create_task(task);
      }
      setCurrentEditTask(null);
    }

    function handleEdit() {
      if ( !task.id ) {
        throw new Error("No id to task you are trying to edit");
      }
      if (task.name && task.name.length > 0) {
        update_task(task.id, task);
      }
      setCurrentEditTask(null);
    }

    function generateTagSelection() {
      // set_new_tag_model_open(false);
      let temp: any = [];

      temp.push(
        <IonSelectOption value='AddTag' key='AddTag'>
          Add +
        </IonSelectOption>
      )

      if (tags) {
        tags.forEach((tag) => {
          let selectBoolean = false;

          if (currentEditTask) {
            if (currentEditTask.tag && currentEditTask.tag.model) {
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
        onDidDismiss={() => {setShowEdit(false);}}
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
                (currentEditTask && currentEditTask.id) ? handleEdit() : handleAdd();
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
              interface='popover'
              placeholder="Add Tag"
              onIonChange={(e) => {
                let selection:string = (e.target as HTMLInputElement).value;
                if (selection === 'AddTag') {
                  setShowEdit(false);
                  setCurrentEditTask(task);
                  setShow_new_tag_model(true);
                } else {
                  task.tag = new UsermodelDto<Tag>(
                    (selection as unknown) as Tag
                  );
                }
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
              value={(task.deadline)?
                (currentEditTask)
                  ? `${task.deadline.get("month") + 1} ${task.deadline.get(
                      "date"
                    )} ${task.deadline.get("year")}`
                  : `${
                      task.deadline.month() + 1
                    } ${task.deadline.date()} ${task.deadline.year()}`:undefined
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

  const NewTagModel = () => {
    
    let tag:Partial<Tag> = {};

    const save_new_tag = async () => {
      return await create_tag( tag );
    };

    return <IonModal
      isOpen={new_tag_model_open}
      onDidDismiss={() => {
        setShow_new_tag_model(false);
        setShowEdit(true);
        // setCurrentEditTask(undefined);
      }}
      cssClass="new-tag-modal"
    ><IonContent className="ion-padding">
    <div className="modal-buttons">
      <p
        className="cancel-button"
        onClick={() => {
          setShow_new_tag_model(false);
        }}
      >
        Cancel
      </p>
      <p
        className="save-button"
        onClick={() => {
          save_new_tag().then( tag => {
            setShow_new_tag_model(false);
            if (!currentEditTask) setCurrentEditTask(new Task());
            currentEditTask!.tag = new UsermodelDto<Tag>(tag);
            setCurrentEditTask( currentEditTask );
          });
        }}
      >
        Save
      </p>
    </div>

<IonItem className="input-item">
  <IonInput
    name="name"
    placeholder="Tag Name"
    id="name-field"
    required
    onIonChange={(e) => {
      tag.name = (e.target as HTMLInputElement).value;
    }}
  ></IonInput>
</IonItem>

<IonItem className="input-item">
  <IonSelect
              name="color"
              id="color-field"
              multiple={false}
              interface='popover'
              placeholder="Select Color"
              onIonChange={(e) => {
                let selection:string = (e.target as HTMLInputElement).value;
                tag.color = TagColors[selection];
              }}
            >
              {(()=>{

                let color_list:JSX.Element[] = [];
                
                for (let color in TagColors) {
                  let selected = tag.color === color;
                  color_list.push(
                    <IonSelectOption value={color} key={color} selected={selected} className={color}>
                      {color}
                    </IonSelectOption>
                  )
                }
                return color_list;
              })()}
            </IonSelect>
</IonItem>
  </IonContent>
    </IonModal>
  }

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
          {renderTasks ? tasksHTML : <LoadingScreen />}

          <DeleteModal />
          {showEdit ? <AddEditModal /> : <React.Fragment />}
          <NewTagModel/>
        </IonContent>
      </IonPage>
    </div>
  );
};
export default Todo;
