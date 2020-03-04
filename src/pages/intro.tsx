import React from 'react';
import { IonSlides, IonSlide, IonContent, IonButton } from '@ionic/react';
import logo from "../assets/logo.png";
import list from "../assets/list.png";
import clock from "../assets/clock.png";
import "../styles/Intro.scss";

const Intro: React.FC = () => {
    const slideOpts = {
        initialSlide: 0,
        speed: 400
    };

    return (
        <React.Fragment>
            <IonContent className="ion-padding">
                <IonSlides pager={true} options={slideOpts} id="slides">
                    <IonSlide>
                        <img src={logo} />
                        <h2>Welcome to TimeScape</h2>
                        <p>A personalized planner centered around the way you want to work</p>
                    </IonSlide>
                    <IonSlide>
                        <img src={list} />
                        <h2>Plan Your Tasks</h2>
                        <p>Create your very own To-Do list to keep track of all the tasks you wish to complete</p>
                    </IonSlide>
                    <IonSlide>
                        <img src={clock} />
                        <h2>Track Your Work Habits</h2>
                        <p>Use TimeScape's built in clock to track the time you spend working throughout the day</p>
                    </IonSlide>
                </IonSlides>
                <div className="footer">
                    <IonButton className="button" href="/register">Get Started</IonButton>
                </div>
            </IonContent>
        </React.Fragment>
    );
};
export default Intro;