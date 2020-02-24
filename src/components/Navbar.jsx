import React from "react";
import { IonContent, IonItem, IonIcon } from "@ionic/react";
import "../styles/Navbar.scss";

const Links = () => {
  const tabs = [
    { name: "To-Do", className: "svg todo" },
    { name: "Report", className: "svg report" },
    { name: "Dashboard", className: "svg dashboard" },
    { name: "Calendar", className: "svg calendar" },
    { name: "Settings", className: "svg settings" }
  ];
  let returnTabs = [];

  tabs.forEach(tab => {
    returnTabs.push(
      <IonItem routerLink="/calendar">
        <div className="tab-div">
          <div className={tab.className} />
          <p>{tab.name}</p>
        </div>
      </IonItem>
    );
  });

  return returnTabs;
};

const Navbar = () => {
  return (
    <div className="navbar-parent">
      <Links />
    </div>
  );
};

export default Navbar;
