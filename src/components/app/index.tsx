import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { checkmark, document, stopwatch, settings } from "ionicons/icons";
import Home from "../../pages/home";
import Login from "../../pages/login";
import Register from "../../pages/register";
import AddTask from "../../pages/addTask";
import Todo from "../../pages/todo";
import Intro from "../../pages/intro";
import Survey from "../../pages/survey";
import Settings from "../../pages/settings";
import Reports from "../../pages/reports";
import DailyReport from "../../pages/dailyReport";
import init_app from "../../init_app";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "../theme/variables.scss";

const App: React.FC = () => {
  init_app();

  let currentTab = window.location.href.split("/");
  let currentTabString = currentTab[currentTab.length - 1];
  console.log(currentTabString, currentTabString in ["login", "register", "intro", "survey", "addtask"]);
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/home" component={Home} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <Route path="/register" component={Register} exact={true} />
            <Route path="/addtask" component={AddTask} exact={true} />
            <Route path="/reports" component={Reports} exact={true} />
            <Route path="/dailyreport" component={DailyReport} exact={true} />
            <Route path="/todo" component={Todo} exact={true} />
            <Route path="/intro" component={Intro} exact={true} />
            <Route path="/survey" component={Survey} exact={true} />
            <Route path="/settings" component={Settings} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/home" />} />
          </IonRouterOutlet>
          {!(["login", "register", "intro", "survey", "addtask"].includes(currentTabString)) ? (

            <IonTabBar slot="bottom">

              <IonTabButton tab="todo" href="/todo">
                <IonIcon icon={checkmark} />
                <IonLabel>To-Do</IonLabel>
              </IonTabButton>

              <IonTabButton tab="home" href="/home">
                <IonIcon icon={stopwatch} />
                <IonLabel>Timer</IonLabel>
              </IonTabButton>

              <IonTabButton tab="reports" href="/reports">
                <IonIcon icon={document} />
                <IonLabel>Reports</IonLabel>
              </IonTabButton>

              <IonTabButton tab="settings" href="/settings">
                <IonIcon icon={settings} />
                <IonLabel>Settings</IonLabel>
              </IonTabButton>
            </IonTabBar>
          ) : (
            <IonTabBar></IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
