import styled from "styled-components";
import SidebarDetails from "../components/SidebarDetails";
import BodyDetails from "../components/ProfileSeller/Top";
import DetailsFeature from "../components/ProfileSeller/Mid";
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardIndex from "../components/CardIndex";
import AvisVoyageurs from "../components/ProfileSeller/Avis";
import axios from 'axios';
import React, { useState, useEffect, useRef,useMemo  } from 'react';


const Container = styled.div`
  /* border: 3px solid red; */
`;

const MainContainer = styled.div`
  margin: 0px 150px;

  @media screen and (max-width: 1250px) {
    margin: 0px 30px;
  }

  @media screen and (max-width: 890px) {
    margin: 0px 20px;
  }
`;

const Wrapper = styled.div`
  /* border: 1px solid red; */
  display: flex;

  @media screen and (max-width: 865px) {
    flex-direction: column;
  }
`;

const SideContainer = styled.aside`
  /* border: 1px solid blue; */
  margin: 0px 8px 15px 0px;
  flex: 1;

  @media screen and (max-width: 865px) {
    margin: 5px 0px 10px;
    order: 2;
  }

  #sticky-container {
    position: sticky;
    top: 17px;
    z-index: 999; // Don't delete it.

    @media screen and (max-width: 865px) {
      position: static;
      z-index: auto;
    }

    #hide-search-box {
      @media screen and (max-width: 865px) {
        display: none;
      }
    }
  }
`;

const HotelContainer = styled.main`
  /* border: 1px solid black; */
  flex: 3;
  @media screen and (max-width: 865px) {
    flex: 1;
  }
`;

const Hotel = () => {
    const [loading, setLoading] = useState(true); // ← nouvel état

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log(id);
const [profile, setProfile] = useState();
useEffect(() => {
  const eventF = async () => {
    try {
      setLoading(true); // ← début du chargement
      const response = await axios.get(`https://waw.com.tn/api/api/business/${id}`);
      setProfile(response.data);
      console.log(response.data);

    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false); // ← fin du chargement
    }
  };
  eventF();
}, []);
  return (
              loading ? (
    <div>Chargement...</div>
  ) : (
    <Container>
        <TopBar />
      <Navbar />
      <MainContainer>
        <Wrapper>
                    <HotelContainer>
            <BodyDetails profile={profile}/>
          </HotelContainer>
        </Wrapper>
                <DetailsFeature profile={profile}/>
      </MainContainer>
            <Footer />

    </Container>
    )
  );
};

export default Hotel;
