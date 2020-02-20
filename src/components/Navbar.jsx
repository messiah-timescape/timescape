import React from "react";
import calendarIcon from "../assets/calendarIcon.png";
import fileIcon from "../assets/fileIcon.png";
import settingsIcon from "../assets/settingsIcon.png";
import stopwatchIcon from "../assets/stopwatchIcon.png";
import todoIcon from "../assets/todoIcon.png";
import "../styles/Navbar.scss";

const Links = () => {
  const tabs = [
    { name: "To-Do", icon: todoIcon },
    { name: "Report", icon: fileIcon },
    { name: "Dashboard", icon: stopwatchIcon },
    { name: "Calendar", icon: calendarIcon },
    { name: "Settings", icon: settingsIcon }
  ];
  let returnTabs = [];

  tabs.forEach(tab => {
    returnTabs.push(
      <div className="tab-div">
        <img src={tab.icon} />
        <p>{tab.name}</p>
      </div>
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
