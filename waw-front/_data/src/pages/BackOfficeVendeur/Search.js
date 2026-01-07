import React, { useState } from "react";
import styled from "styled-components";
import TwoStateInteractiveIcon from "./TwoStatesInteractiveIcon";
import content from "./content";

const StyledSearch = styled.div`
  form {
    position: relative;
    display: inline-block;
    height: 32px;
    border-radius: 16px;
    padding: 0 16px 0 0;
    background: ${({ bg }) => bg};
  }

  input {
    position: absolute;
    left: 0;
    top: 0;
    height: inherit;
    box-sizing: border-box;
    padding: 0 40px 0 16px;
    border-radius: inherit;
    width: 100%;
    /* Type4 */
    font: 13px/16px InterSemiBold, sans-serif;
    border: none;
    background: transparent;
    color: ${({ color }) => color};

    &:focus {
      background: transparent;
      border-radius: inherit;
    }

    ::-webkit-input-placeholder,
    :-ms-input-placeholder,
    ::placeholder {
      color: ${({ placeholderColor }) => placeholderColor};
    }
  }

  .btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    border-radius: inherit;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    height: inherit;
    padding: 8px 16px 8px 8px;
    box-sizing: border-box;

    &:hover {
      background: transparent;

      path {
        fill: ${({ color }) => color};
      }
    }
  }
`;

const Search = ({ className }) => {
  const [searchValue, updateSearchValue] = useState("");

  // const handleSubmit = e => {
  //   e.preventDefault();

  //   if (this.state.title !== "") {
  //     this.props.addItem(this.state.title);
  //     this.setState({ title: "" });
  //   }
  // }

  const clickHandler = toggle => {
    if (toggle !== "") {
      updateSearchValue("");
    }
  };

  return (
    <StyledSearch
      className={className}
      bg={content.colors.gray["100"]}
      placeholderColor={content.colors.default.subtitle}
      color={content.colors.default.headline}
    >
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          name="title"
          placeholder="Find a pipe"
          value={searchValue}
          onChange={e => updateSearchValue(e.target.value)}
        />
        <TwoStateInteractiveIcon
          className="btn"
          states={[
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1C3.239 1 1 3.239 1 6C1 8.761 3.239 11 6 11C8.761 11 11 8.761 11 6C11 3.239 8.761 1 6 1ZM6 9C4.346 9 3 7.654 3 6C3 4.346 4.346 3 6 3C7.654 3 9 4.346 9 6C9 7.654 7.654 9 6 9Z"
                fill="#8492A6"
              />
              <path
                d="M14.707 13.293L11.707 10.293C11.316 9.902 10.684 9.902 10.293 10.293C9.902 10.684 9.902 11.316 10.293 11.707L13.293 14.707C13.488 14.902 13.744 15 14 15C14.256 15 14.512 14.902 14.707 14.707C15.098 14.316 15.098 13.684 14.707 13.293Z"
                fill="#8492A6"
              />
            </svg>,
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.41401 8.00001L12.707 4.70701C13.098 4.31601 13.098 3.68401 12.707 3.29301C12.316 2.90201 11.684 2.90201 11.293 3.29301L8.00001 6.58601L4.70701 3.29301C4.31601 2.90201 3.68401 2.90201 3.29301 3.29301C2.90201 3.68401 2.90201 4.31601 3.29301 4.70701L6.58601 8.00001L3.29301 11.293C2.90201 11.684 2.90201 12.316 3.29301 12.707C3.48801 12.903 3.74401 13 4.00001 13C4.25601 13 4.51201 12.902 4.70701 12.707L8.00001 9.41401L11.293 12.707C11.488 12.903 11.744 13 12 13C12.256 13 12.512 12.902 12.707 12.707C13.098 12.316 13.098 11.684 12.707 11.293L9.41401 8.00001Z"
                fill="black"
              />
            </svg>
          ]}
          toggle={searchValue === ""}
          onClick={searchValue => clickHandler(searchValue)}
        />
      </form>
    </StyledSearch>
  );
};

export default Search;
