import React, { useState } from "react";
import { IonSlides, IonSlide, IonContent, IonButton, IonProgressBar, IonItem, IonPicker, IonInput } from '@ionic/react';
import "../styles/Survey.scss";
import { store_survey } from "../controllers/user/survey";

const Survey: React.FC = () => {

    function handleSubmit(interval, sleep, wake, workDays, workStart, workStop) {
        store_survey(interval, sleep, wake, workDays, workStart, workStop);
    }

    const slideOpts = {
        initialSlide: 0,
        speed: 400
    };
    const [progressValue, setProgressValue] = useState(0.25);
    return (
        <IonContent className="ion-padding">
            <IonSlides options={slideOpts} onIonSlideDidChange={function () {setProgressValue(progressValue + 0.25)}}>
                <IonSlide>
                    <p>How many hours do you sepnd working before needing a break?</p>
                    <IonItem>
                        <IonInput id="work-interval" placeholder="Example 3.5"></IonInput>
                    </IonItem>
                </IonSlide>
                <IonSlide>
                    <h2 className="h2-survey">Plan Your Tasks</h2>
                    <p className="p-survey">Create your very own To-Do list to keep track of all the tasks you wish to complete</p>
                </IonSlide>
                <IonSlide>
                    <h2 className="h2-survey">Track Your Work Habits</h2>
                    <p className="p-survey">Use TimeScape's built in clock to track the time you spend working throughout the day</p>
                </IonSlide>
                <IonSlide>
                    <h2 className="h2-survey">See Your Stats</h2>
                    <p className="p-survey">TimeScape keeps track of how you work, neatly assembling your data in reports to help you visualize the way you work</p>
                </IonSlide>
            </IonSlides>
            <IonProgressBar value={progressValue}></IonProgressBar>
        </IonContent>
    );
};
export default Survey;