import React from "react";
import styled from "styled-components";

const StyledAvatar = styled.img`
  border-radius: 50%;

  ${({ zoom }) =>
    zoom
      ? `
    transition: transform 0.15s cubic-bezier(0.2, 0, 0.38, 0.9);
  `
      : ""}
`;

const Avatar = ({ src, zoom = false, ...props }) => {
  return (
    <StyledAvatar
      src={src}
      alt=""
      zoom={zoom}
      {...props}
      className="avatar--zoom"
    />
  );
};

export default Avatar;
