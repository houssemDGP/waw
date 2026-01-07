import React from "react";
import styled from "styled-components";

const StyledGuidelines = styled.div`
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 3px,
      rgba(255, 90, 90, 0.375) 4px,
      rgba(255, 90, 90, 0.375) 5px,
      rgba(255, 255, 255, 0) 7px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0) 3px,
      rgba(255, 90, 90, 0.375) 4px,
      rgba(255, 90, 90, 0.375) 5px,
      rgba(255, 255, 255, 0) 7px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255, 90, 90, 0.5),
      rgba(255, 255, 255, 0) 2px,
      rgba(255, 255, 255, 0) 7px,
      rgba(255, 90, 90, 0.5) 8px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 90, 90, 0.5),
      rgba(255, 255, 255, 0) 2px,
      rgba(255, 255, 255, 0) 7px,
      rgba(255, 90, 90, 0.5) 8px
    );
  background-position: -8px -3px;
  position: absolute;
  padding: 24px;
`;

const Guidelines = ({ children, ...props }) => (
  <StyledGuidelines {...props}>{children}</StyledGuidelines>
);

export default Guidelines;
