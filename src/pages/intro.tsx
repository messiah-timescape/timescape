import React from 'react';
import { IonSlides, IonSlide, IonContent, IonButton } from '@ionic/react';
import logo from "../assets/logo.png";
import list from "../assets/list.png";
import clock from "../assets/clock.png";
import graph from "../assets/graph.png";
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
                        <img className="img-intro" src={logo} alt=""/>
                        <h2 className="h2-intro">Welcome to TimeScape</h2>
                        <p className="p-intro">A personalized planner centered around the way you want to work</p>
                    </IonSlide>
                    <IonSlide>
                        <img className="img-intro" src={list} alt=""/>
                        <h2 className="h2-intro">Plan Your Tasks</h2>
                        <p className="p-intro">Create your very own To-Do list to keep track of all the tasks you wish to complete</p>
                    </IonSlide>
                    <IonSlide>
                        <img className="img-intro" src={clock} alt=""/>
                        <h2 className="h2-intro">Track Your Work Habits</h2>
                        <p className="p-intro">Use TimeScape's built in clock to track the time you spend working throughout the day</p>
                    </IonSlide>
                    <IonSlide>
                        <img className="img-intro" src={graph} alt=""/>
                        <h2 className="h2-intro">See Your Stats</h2>
                        <p className="p-intro">TimeScape keeps track of how you work, neatly assembling your data in reports to help you visualize the way you work</p>
                    </IonSlide>
                </IonSlides>
                <div className="footer">
                    <IonButton className="button-intro" href="/register">Get Started</IonButton>
                </div>
            </IonContent>
        </React.Fragment>
    );
};
export default Intro;