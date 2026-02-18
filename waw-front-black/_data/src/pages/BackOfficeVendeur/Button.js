import React from "react";
import styled from "styled-components";
import { Type4 } from "./Typography";
import Avatar from "./Avatar";

const StyledButton = styled.button`
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);

  * {
    margin-right: 12px;

    &:last-child {
      margin: 0;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }

  path {
    transition: fill 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);
  }

  p {
    white-space: pre;
  }

  ${({ children }) =>
    children
      ? `
  padding: 8px 16px;
  `
      : ""}

  ${({ primary }) =>
    primary
      ? `
    background: #0b66ff;
    color: #fff;
  `
      : ""}

  ${({ avatar }) =>
    avatar
      ? `
      border-radius: 50%;
      padding: 2px;
      border: 1px solid #e2e2e2;
      background: #fff;
      
      img {
        width: 32px;
        height: 32px;
      }
  `
      : ""}

    &:hover {
    path {
      fill: #001738;
    }
  }

  &.button--icon {
    position: relative;
    width: 32px;
    padding: 8px;

    path {
      fill: #fff;
    }
  }

  &.button--transparent {
    padding: 8px;
    margin: 0 -8px;
    /* background: green; */

    .button--icon {
      width: 32px;
    }

    path {
      fill: #8492A6;
    }
  }

  &.button--notification::after {
    content: '';
    position: absolute;
    background: red;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    top: 8px;
    right: 8px;
  }
`;

const Button = ({ primary, avatar, icon, className, children, ...props }) => {
  return (
    <StyledButton
      primary={primary}
      avatar={avatar}
      className={className}
      children={!!children}
      {...props}
    >
      {avatar && <Avatar src={avatar} />}
      {icon && icon}
      {children && <Type4>{children}</Type4>}
    </StyledButton>
  );
};

export default Button;
