import React from "react";
import InteractiveIcon from "./InteractiveIcon";

const TwoStatesInteractiveIcon = ({
  states = ["", ""],
  toggle = false,
  ...props
}) => <InteractiveIcon icon={toggle ? states[0] : states[1]} {...props} />;

export default TwoStatesInteractiveIcon;
