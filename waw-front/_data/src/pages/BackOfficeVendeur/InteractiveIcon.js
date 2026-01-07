import React from "react";
import styled from "styled-components";
import content from "./content";

const StyledButtonIcon = styled.button`
  display: inline-block;
  background-color: transparent;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 8px;
  transition: background-color 0.15s ${({ ease }) => ease};

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: #212529;
  }
`;

const StyledLinkIcon = styled.a`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 8px;
  transition: background-color 0.15s ${({ ease }) => ease};

  &:hover {
    background-color: #212529;
  }
`;

const StyledIcon = styled.span`
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: content-box;
  transition: transform 0.15s ${({ ease }) => ease};

  svg {
    position: relative;
    width: 100%;
    height: 100%;
  }

  path {
    transition: fill 0.15s ${({ ease }) => ease};
    fill: ${({ color }) => color};
  }

  &:hover path {
    fill: #fff;
  }

  &:active {
    transform: scale(0.875);
    /* transform: scale3D(0.75, 0.75, 1); */
  }
`;

const InteractiveIcon = ({
  icon,
  type = "button",
  borderRadius = "4px",
  color = content.colors.default.icon,
  ...props
}) => {
  if (type === "button") {
    return (
      <StyledButtonIcon
        borderRadius={borderRadius}
        ease={content.ease}
        {...props}
      >
        <StyledIcon color={color} ease={content.ease}>
          {icon}
        </StyledIcon>
      </StyledButtonIcon>
    );
  } else {
    return (
      <StyledLinkIcon
        borderRadius={borderRadius}
        ease={content.ease}
        {...props}
      >
        <StyledIcon color={color} ease={content.ease}>
          {icon}
        </StyledIcon>
      </StyledLinkIcon>
    );
  }
};

export default InteractiveIcon;
