import React from "react";
import { IonContent, IonPage, IonInput, IonItem, IonTextarea, IonIcon, IonSelect, IonSelectOption, IonDatetime } from "@ionic/react";
import { bookmark, clipboard, time } from "ionicons/icons";
import "../styles/AddTask.scss";

const AddTask: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <p className="save-button">Save</p>

        <form className="form-addTask">
          <IonItem className="input-item">
            <IonIcon className="icon"></IonIcon>
            <IonInput name="title" placeholder="Add Title" id="title-field" required></IonInput>
          </IonItem>

          <IonItem className="input-item">
            <IonIcon className="icon" icon={bookmark}></IonIcon>
            <IonSelect name="tags" placeholder="Add Tags" id="tags-field" multiple={true}>
              <IonSelectOption value="school">School</IonSelectOption>
              <IonSelectOption value="chore">Chore</IonSelectOption>
              <IonSelectOption value="work">Work</IonSelectOption>
              <IonSelectOption value="hobbie">Hobbie</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem className="input-item">
            <IonIcon className="icon" icon={clipboard} id="clipboard"></IonIcon>
            <IonTextarea name="notes" placeholder="Add Note" id="notes-field" rows={9}></IonTextarea>
          </IonItem>

          <IonItem className="input-item">
            <IonIcon className="icon" icon={time}></IonIcon>
            <IonDatetime name="time" displayFormat="MM DD YYYY" placeholder="Add Due Date" id="time-field"></IonDatetime>
          </IonItem>
        </form>

        {/* <IonItem>
          <IonDatetime displayFormat="MM DD YYYY" placeholder="Select Date"></IonDatetime>
        </IonItem> */}

      </IonContent>
      <hr></hr>
    </IonPage>
  );
};

export default AddTask;
