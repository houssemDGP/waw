import React from "react";
import styled from "styled-components";
import Card from "./Card";
import { Type1, Type4 } from "./Typography";
import Avatar from "./Avatar";
import content from "./content";

const StyledCardGrid = styled.div`
  position: relative;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  margin: 16px 0;
`;

const CardGrid = ({
  wide = false,
  cards,
  easeSpeed,
  easeFunction,
  avatar,
  ...props
}) => {
  const gridClasses = wide ? "grid grid--wide" : "grid";

  return (
    <StyledCardGrid className={gridClasses} {...props}>
      {!wide && (
        <Card
          easeSpeed={easeSpeed}
          easeFunction={easeFunction}
          title="Add new pipe"
          iconColor={content.colors.gray["200"]}
          simpleCard
          cardColor={content.colors.gray["100"]}
          borderColor={content.colors.gray["200"]}
          shadowColor={"transparent"}
        >
          <Avatar
            zoom
            src={avatar}
            style={{
              width: "40px",
              height: "40px",
              border: "8px solid #fff",
              margin: "24px auto 4px"
            }}
          />
          <Type1 style={{ fontSize: "40px", lineHeight: "48px" }}>242</Type1>
          <Type4>
            Assigned
            <br />
            to you
          </Type4>
        </Card>
      )}
      {cards.map((card, index) => (
        <Card
          key={index}
          wide={wide}
          {...card}
          easeSpeed={easeSpeed}
          easeFunction={easeFunction}
        />
      ))}
      {!wide && (
        <Card
          logo={
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                opacity="0.1"
                width="72"
                height="72"
                rx="36"
                fill="#0B66FF"
              />
              <rect
                opacity="0.1"
                x="8"
                y="8"
                width="56"
                height="56"
                rx="28"
                fill="#0B66FF"
              />
              <path
                d="M34.5 27C34.2239 27 34 27.2239 34 27.5V34H27.5C27.2239 34 27 34.2239 27 34.5V36.5C27 36.7761 27.2239 37 27.5 37H34V43.5C34 43.7761 34.2239 44 34.5 44H36.5C36.7761 44 37 43.7761 37 43.5V37H43.5C43.7761 37 44 36.7761 44 36.5V34.5C44 34.2239 43.7761 34 43.5 34H37V27.5C37 27.2239 36.7761 27 36.5 27H34.5Z"
                fill="#0B66FF"
              />
            </svg>
          }
          easeSpeed={easeSpeed}
          easeFunction={easeFunction}
          title="Add new pipe"
          iconColor="#2979ff"
          addPipe={true}
          simpleCard
        />
      )}
    </StyledCardGrid>
  );
};

export default CardGrid;
