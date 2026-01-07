import {
  CalendarMonthOutlined,
  HelpOutlineOutlined,
  LocationOnOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
const Container = styled.div`
  background-color: #d65113;
  border: 1px solid #003580;
  border-radius: 3px;
  min-width: 300px;
  padding: 15px;
  color: white;
  margin: 15px 0px;

  @media screen and (max-width: 340px) {
    min-width: 270px;
  }

  h2 {
    font-size: 22px;
    font-weight: 500;
    margin-bottom: 10px;
  }
`;

const Form = styled.form`
  /* border: 3px solid red; */
  display: flex;
  flex-direction: column;

  .search-icon {
    margin-right: 3px;
    font-size: 25px;
    height: 100%;
  }
`;

const LocationContainer = styled.div`
  /* border: 1px solid black; */
  color: #424d5f;
  margin-bottom: 10px;

  label {
    font-size: 13px;
    color: white;
  }
`;

const Wrapper = styled.div`
  /* border: 1px solid black; */
  background-color: white;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 5px 5px 5px 2px;
  border-radius: 3px;

  input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    font-size: 14px;
    cursor: pointer;
  }
`;

const DateContainer = styled(LocationContainer)`
  /* border: 1px solid red; */
  position: relative;

  .calendar-span {
    /* border: 1px solid black; */
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .date-range {
    box-shadow: 0px 0px 3px -2px black;
    border: 1px solid #cbcbcb;
    border-radius: 3px;
    position: absolute;
    top: 62px;
    left: 0px;
    z-index: 1;

    @media screen and (max-width: 426px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const PersonContainer = styled(LocationContainer)`
  /* border: 1px solid red; */
  position: relative;

  .person-span {
    /* border: 1px solid black; */
    font-size: 14px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const PersonQuantityContainer = styled.div`
  box-shadow: 0px 0px 3px -2px black;
  border: 1px solid #cbcbcb;
  border-radius: 3px;
  position: absolute;
  top: 63px;
  left: 0px;
  z-index: 10;
  background-color: white;
  padding: 10px 5px;

  @media screen and (max-width: 426px) {
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
  }
`;

const QuantityItem = styled.div`
  width: 280px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 426px) {
    width: 215px;
    font-size: 13px;
  }
`;

const QuantityBtnContainer = styled.div`
  /* border: 1px solid black; */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CounterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 40px;
  font-size: 20px;
  border-radius: 20px;
  background-color: #e98d0f ;
  color: white;
  border: 1px solid #e98d0f ;
  cursor: pointer;

  @media screen and (max-width: 426px) {
    height: 21px;
    width: 35px;
    font-size: 17px;
  }

  &:disabled {
    cursor: default;

    &:hover {
      background-color: #e98d0f ;
      color: white;
    }
  }

  &:hover {
    background-color: white;
    color: #e98d0f ;
  }
`;

const Quantity = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 45px;
  font-size: 20px;
  font-weight: 600;
  border: 1px solid #3d91ff;
  border-radius: 50%;
  margin: 0px 10px;
  background-color: white;
  color: #3d91ff;
  cursor: default;

  @media screen and (max-width: 426px) {
    height: 35px;
    width: 35px;
    font-size: 18px;
  }
`;

const CheckboxContainer = styled.div`
  /* border: 1px solid black; */
`;

const FirstCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Checkbox = styled.div`
  input {
    margin-right: 7px;
    transform: scale(1.38);
  }

  label {
    font-size: 13px;
    cursor: pointer;
  }
`;

const HelpIconContainer = styled.span`
  /* border: 1px solid black; */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0px;
  position: relative;

  &:hover span {
    visibility: visible;
  }

  .help-icon {
    color: white;
    font-size: 20px;
    cursor: pointer;
  }

  span {
    position: absolute;
    top: 30px;
    background-color: #00224f;
    color: white;
    font-size: 13px;
    width: 300px;
    text-align: center;
    padding: 7px;
    border-radius: 2px;
    z-index: 5;
    visibility: hidden;

    @media screen and (max-width: 925px) {
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      width: 230px;
    }
  }

  span::before {
    content: "";
    position: absolute;
    top: -15px;
    left: 50%;
    margin-left: -7px;
    border: 8px solid;
    border-color: transparent transparent #00224f transparent;

    @media screen and (max-width: 925px) {
      border-color: transparent transparent transparent #00224f;
      left: 230px;
      top: 50%;
      transform: translateY(-50%);
      margin: 0px;
    }
  }
`;

const SecondCheckbox = styled(FirstCheckbox)``;

const Button = styled.button`
  background-color: #1c4f6c ;
  margin: 25px auto 10px;
  border: 1px solid #1c4f6c ;
  padding: 9.5px;
  border-radius: 3px;
  font-size: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background-color: #1c4f6c ;
    border: 1px solid white;
  }
`;

const SidebarDetails = () => {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 2,
    children: 1,
    room: 1,
  });

  const handleCount = (name, operation) => {
    // console.log(options["room"], name, options[name]); // Accessing room key's value by Square Bracket method from "options" Object. We are using options[name] because here name variable is String that is "room". We can't use it like options.name bcoz it means options."room" which is undefined.

    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  return (
    <Container>
      <h2>À partir de 99 TND</h2>
      <Form>
        <h4>Sélectionnez la date et les voyageurs</h4>
        <DateContainer onClick={() => setOpenOptions(false)}>
          <Wrapper>
            <CalendarMonthOutlined className="search-icon" />
            <span
              className="calendar-span"
              onClick={() => setOpenDate(!openDate)}
            >
              {`${format(date[0].startDate, "dd/MM/yyyy")}   to   ${format(
                date[0].endDate,
                "dd/MM/yyyy"
              )}`}
            </span>
          </Wrapper>
        </DateContainer>

        <PersonContainer onClick={() => setOpenDate(false)}>
          <Wrapper>
            <PersonOutlineOutlined className="search-icon" />

            <span
              className="person-span"
              onClick={() => setOpenOptions(!openOptions)}
            >
              {`${options.adult} ${options.adult <= 1 ? "Adulte" : "Adultes"} - ${
                options.children
              } ${options.children <= 1 ? "Enfant" : "Enfant"} `}
            </span>
            {openOptions && (
              <PersonQuantityContainer>
                <QuantityItem>
                  <span>Adulte</span>
                  <QuantityBtnContainer>
                    <CounterBtn
                      type="button"
                      disabled={options.adult <= 1}
                      onClick={() => handleCount("adult", "dec")}
                    >
                      -
                    </CounterBtn>
                    <Quantity>{options.adult}</Quantity>
                    <CounterBtn
                      type="button"
                      onClick={() => handleCount("adult", "inc")}
                    >
                      +
                    </CounterBtn>
                  </QuantityBtnContainer>
                </QuantityItem>

                <QuantityItem>
                  <span>Enfant</span>
                  <QuantityBtnContainer>
                    <CounterBtn
                      type="button"
                      disabled={options.children <= 0}
                      onClick={() => handleCount("children", "dec")}
                    >
                      -
                    </CounterBtn>
                    <Quantity>{options.children}</Quantity>
                    <CounterBtn
                      type="button"
                      onClick={() => handleCount("children", "inc")}
                    >
                      +
                    </CounterBtn>
                  </QuantityBtnContainer>
                </QuantityItem>
              </PersonQuantityContainer>
            )}
          </Wrapper>
        </PersonContainer>
        <Button type="button">Mettre à jour la recherche</Button>
      </Form>
    </Container>
  );
};

export default SidebarDetails;
