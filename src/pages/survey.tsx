import React, { useState } from "react";
import {
  IonContent,
  IonButton,
  IonProgressBar,
  IonItem,
  IonModal,
  IonLabel,
  IonCheckbox,
  IonList,
  IonDatetime
} from "@ionic/react";
import "../styles/Survey.scss";
import { store_survey } from "../controllers/user/survey";
import { userlink_google, user_hasgoogle } from "../controllers/user/link_google";
//import user from "../controllers/user/index"
import moment from "moment";
import Weekdays from "../utils/weekdays";
import googleIcon from "../assets/googleIcon.png"

const Survey: React.FC = () => {
  const [progressValue, setProgressValue] = useState(0.25);
  const [modalNum, setModalNum] = useState(0);
  const days = [
    { val: "Monday", isChecked: false },
    { val: "Tuesday", isChecked: false },
    { val: "Wednesday", isChecked: false },
    { val: "Thursday", isChecked: false },
    { val: "Friday", isChecked: false },
    { val: "Saturday", isChecked: false },
    { val: "Sunday", isChecked: false }
];

  const [overworkLimit, setOverworkLimit] = useState(moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0}));
  const [workDays, setWorkDays] = useState([""]);
  const [workStart, setWorkStart] = useState(moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0}));
  const [workStop, setWorkStop] = useState(moment({hour: 0, minute: 0, seconds: 0, milliseconds: 0}));

  function handleSubmit(overworkLimit, sleep, wake, workDays, workStart, workStop) {
      store_survey({
        work_days: workDays,
        overwork_limit: overworkLimit,
        sleep_start: sleep,
        sleep_stop: wake,
        work_start_time: workStart,
        work_stop_time: workStop
      });

      user_hasgoogle().then((has_google:boolean) => {
        if ( has_google ) {
          toHome();
        } else {
          next();
        }
      });
  }

  function updateOverworkLimit(time: String) {
    if (time !== undefined) {
      let val = time.split('T').pop();
      let val2 = val? val.split(':') : "";
      setOverworkLimit(overworkLimit.add(val2[0], 'hour').add(val2[1], 'minute'));
    } else {
      setOverworkLimit(overworkLimit.add(3, 'hour'));
    }

    next();
  }

  function updateWorkDays(...days: boolean[]) {
    let week = [
      Weekdays.Monday,
      Weekdays.Tuesday,
      Weekdays.Wednesday,
      Weekdays.Thursday,
      Weekdays.Friday,
      Weekdays.Saturday,
      Weekdays.Sunday
    ]

    let count = 0;
    let count2 = 0;
    let sub = [""];
    for (let day of days) {
      if (day) {
        sub[count2] = week[count];
        count2++;
      }
      count++;
    }

    setWorkDays(sub);
    next();
  }

  function updateStartTime(time: String) {
    if (time !== undefined) {
      let val = time.split('T').pop();
      let val2 = val? val.split(':') : "";
      setWorkStart(workStart.add(val2[0], 'hour').add(val2[1], 'minute'));
    } else {
      setWorkStart(workStart.add(12, 'hour'));
    }

    next();
  }

  function updateStopTime(time: String) {
    if (time !== undefined) {
      let val = time.split('T').pop();
      let val2 = val? val.split(':') : "";
      setWorkStop(workStop.add(val2[0], 'hour').add(val2[1], 'minute'));
    } else {
      setWorkStop(workStop.add(21, 'hour'));
    }

    handleSubmit(overworkLimit, moment({hour: 0}), moment({hour: 0}), workDays, workStart, workStop);
  }

  function next() { // all the animation stuff for the next menu
    setModalNum(modalNum + 1);
    setProgressValue(progressValue + 0.2);
}

  function toHome() { //Sends the user the the dashboard
    let url = window.location.href.split("/");
    url[3] = "home";
    window.location.href = url.join("/");
  }

  function syncAccounts() {
    userlink_google().then(() => {
      toHome();
    });
  }

  return (
    <IonContent className="ion-padding">
      <IonModal
        cssClass="survey-modal-1"
        isOpen={modalNum === 0}
        backdropDismiss={false}
        showBackdrop={false}
        keyboardClose={false}
      >
        <IonContent>
          <p className="modal-title">
            How much time do you typically spend working on something before
            needing <br />a break?
          </p>
          <IonItem>
            <IonDatetime id="overwork" displayFormat="H:mm" minuteValues="0,15,30,45" placeholder="Pick a Time"></IonDatetime>
          </IonItem>
          <IonButton
            className="survey-nextButton"
            onClick={() => updateOverworkLimit((document.getElementById("overwork") as HTMLInputElement).value)}>Next</IonButton>
        </IonContent>
      </IonModal>

      <IonModal
        cssClass="survey-modal-2"
        isOpen={modalNum === 1}
        backdropDismiss={false}
        showBackdrop={false}
        keyboardClose={false}
      >
        <p>On what days of the week do you normally do your work?</p>

        <IonList>
          {days.map(({ val, isChecked }) => (
            <IonItem key={val}>
              <IonLabel>{val}</IonLabel>
              <IonCheckbox slot="end" id={val} value={val} checked={isChecked} />
            </IonItem>
          ))}
        </IonList>
        <IonButton className="survey-nextButton" onClick={() => updateWorkDays(
          (document.getElementById("Monday") as HTMLInputElement).checked,
          (document.getElementById("Tuesday") as HTMLInputElement).checked,
          (document.getElementById("Wednesday") as HTMLInputElement).checked,
          (document.getElementById("Thursday") as HTMLInputElement).checked,
          (document.getElementById("Friday") as HTMLInputElement).checked,
          (document.getElementById("Saturday") as HTMLInputElement).checked,
          (document.getElementById("Sunday") as HTMLInputElement).checked
        )}>
          Next
        </IonButton>
      </IonModal>

      <IonModal
        cssClass="survey-modal-1"
        isOpen={modalNum === 2}
        backdropDismiss={false}
        showBackdrop={false}
        keyboardClose={false}
      >
        <IonContent className="ion-padding">
          <p>
            What time of day do you usually start working?
          </p>
          <IonItem>
            <IonDatetime id="startWork" displayFormat="h:mm A" placeholder="Pick a Time"></IonDatetime>
          </IonItem>
          <IonButton
            className="survey-nextButton"
            onClick={() => updateStartTime((document.getElementById("startWork") as HTMLInputElement).value)}>
            Next
          </IonButton>
        </IonContent>
      </IonModal>

      <IonModal
        cssClass="survey-modal-1"
        isOpen={modalNum === 3}
        backdropDismiss={false}
        showBackdrop={false}
        keyboardClose={false}
      >
        <IonContent className="ion-padding">
          <p>
            What time of day do you usually stop working?
          </p>
          <IonItem>
            <IonDatetime id="stoptWork" displayFormat="h:mm A" placeholder="Pick a Time"></IonDatetime>
          </IonItem>
          <IonButton
            className="survey-nextButton"
            onClick={() => updateStopTime((document.getElementById("stoptWork") as HTMLInputElement).value)}>
            Next
          </IonButton>
        </IonContent>
      </IonModal>

      <IonModal 
      cssClass="google-modal"
      isOpen={ modalNum === 4 }
      backdropDismiss={false}
      showBackdrop={false}
      keyboardClose={false}
      >
        <IonContent className="ion-padding">
          <p>Sync your new account with Google for extra features!</p>

          <button id="sync-button" onClick={() => syncAccounts()}>
                <img id="googlePic" src={googleIcon} alt="google login icon" />
                <p>Sync with Google</p>
          </button>

          <button id="skip-button" onClick={() => toHome()}>
                <p>Skip</p>
          </button>
        </IonContent>
      </IonModal>

      <IonProgressBar value={progressValue}></IonProgressBar>
    </IonContent>
  );
};
export default Survey;
