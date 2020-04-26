import React from "react";
import "../styles/LoadingIcon.scss";

const LoadingIcon = () => {
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingIcon;
