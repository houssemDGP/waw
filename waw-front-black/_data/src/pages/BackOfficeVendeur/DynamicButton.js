import React from "react";
import Button from "./Button";

const DynamicButton = ({ regular, small }) => {
  return (
    <div className="dynamic-button">
      {regular}
      {small}
    </div>
  );
};

export default DynamicButton;
