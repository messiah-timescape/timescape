import React, { useState } from "react";
import { IonContent, IonButton, IonProgressBar, IonItem, IonInput, IonModal, IonLabel, IonGrid, IonCol, IonRow, IonCheckbox, IonList } from '@ionic/react';
import "../styles/Survey.scss";
import { store_survey } from "../controllers/user/survey";

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

    const [interval, setInterval] = useState(null);
    const [sleep, setSleep] = useState();
    const [wake, setWake] = useState();
    const [workDays, setWorkDays] = useState(null);
    const [workStart, setWorkStart] = useState(null);
    const [workStop, setWorkStop] = useState(null);

    function handleSubmit(interval, sleep, wake, workDays, workStart, workStop) {
        store_survey(interval, sleep, wake, workDays, workStart, workStop);
    }

    function next() {
        setModalNum(modalNum + 1);
        setProgressValue(progressValue + 0.25);
        console.log(interval, sleep, wake, workDays, workStart, workStop);
    }

    function modal1 (h, m) {
        setInterval(h + m);
        next();
    }

    function modal2 (s: String, w: String) {
        setSleep(s);
        setWake(w);
        next();
    }

    function modal3 (...arg: string[]) {
        //to be determined, not functional yet
        next();
    }

    function modal4 (wStart, wStop) {
        setWorkStart(wStart);
        setWorkStop(wStop);
        //handleSubmit(interval, sleep, wake, workDays, workStart, workStop);
        let url = window.location.href.split("/");
            url[3] = "home";
            window.location.href = url.join("/");
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
                    <p className="modal-title">How much time do you typically spend working on something before needing <br />a break?</p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-lg="4">
                                <IonItem>
                                    <IonLabel>Hours</IonLabel>
                                    <IonInput id="hours-field" placeholder="3"></IonInput>
                                </IonItem>
                            </IonCol>
                            <IonCol size-lg="4">
                                <IonItem>
                                    <IonLabel>Minutes</IonLabel>
                                    <IonInput id="minutes-field" placeholder="30"></IonInput>
                                </IonItem>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonButton className="survey-nextButton" 
                    onClick={() =>
                        modal1(
                            (document.getElementById("hours-field") as HTMLInputElement).value, 
                            (document.getElementById("minutes-field") as HTMLInputElement).value
                        )
                      }>Next</IonButton>
                </IonContent>
            </IonModal>

            <IonModal 
            cssClass="survey-modal-2"
            isOpen={modalNum === 1}
            backdropDismiss={false} 
            showBackdrop={false} 
            keyboardClose={false}
            >
                <IonContent className="ion-padding">
                    <p className="modal-title">When do you normaly go to bed and when do you usually wake up?</p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-lg="6" offset="2">
                                <div className="modal-item">
                                    <IonItem>
                                        <IonLabel>Bedtime</IonLabel>
                                        <IonInput id="bedtime-field" placeholder="11pm"></IonInput>
                                    </IonItem>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size-lg="6" offset="2">
                                <div className="modal-item">
                                    <IonItem>
                                        <IonLabel>Wake Up</IonLabel>
                                        <IonInput id="wakeUp-field" placeholder="8am"></IonInput>
                                    </IonItem> 
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonButton className="survey-nextButton" 
                    onClick={() =>
                        modal2(
                            (document.getElementById("bedtime-field") as HTMLInputElement).value, 
                            (document.getElementById("wakeUp-field") as HTMLInputElement).value
                        )
                      }>Next</IonButton>
                </IonContent>
                
            </IonModal>

            <IonModal
            cssClass="survey-modal-3"
            isOpen={modalNum === 2}
            backdropDismiss={false} 
            showBackdrop={false} 
            keyboardClose={false}
            >
                <p>On what days of the week do you normally do your work?</p>

                <IonList>
                    { days.map(({val, isChecked}) => (
                        <IonItem key={val}>
                            <IonLabel>{val}</IonLabel>
                            <IonCheckbox slot="end" value={val} checked={isChecked} />
                        </IonItem>
                    )) }
                </IonList>
                <IonButton className="survey-nextButton" onClick={() => next()}>Next</IonButton>
            </IonModal>

            <IonModal
            cssClass="survey-modal-2"
            isOpen={modalNum === 3}
            backdropDismiss={false} 
            showBackdrop={false} 
            keyboardClose={false}
            >
                <IonContent className="ion-padding">
                    <p>What time of day do you usually start working and when do you stop?</p>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-lg="6" offset="2">
                                <div className="modal-item">
                                    <IonItem>
                                        <IonLabel>Start</IonLabel>
                                        <IonInput id="start-field" placeholder="12pm"></IonInput>
                                    </IonItem>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol size-lg="6" offset="2">
                                <div className="modal-item">
                                    <IonItem>
                                        <IonLabel>Stop</IonLabel>
                                        <IonInput id="stop-field" placeholder="9pm"></IonInput>
                                    </IonItem> 
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonButton className="survey-nextButton" 
                    onClick={() =>
                        modal4(
                            (document.getElementById("start-field") as HTMLInputElement).value, 
                            (document.getElementById("stop-field") as HTMLInputElement).value
                        )
                      }>Next</IonButton>
                </IonContent>
            </IonModal>
            
            <IonProgressBar value={progressValue}></IonProgressBar>
        </IonContent>
    );
};
export default Survey;