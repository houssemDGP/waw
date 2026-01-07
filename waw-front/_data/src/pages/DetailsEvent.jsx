import styled from "styled-components";
import SidebarDetails from "../components/SidebarDetails";
import BodyDetails from "../components/BodyDetailsEvent";
import DetailsFeature from "../components/DetailsFeatureEvent";
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardIndex from "../components/CardIndex";
import AvisVoyageurs from "../components/AvisVoyageurs";
import PageMeta from "../components/common/PageMeta";


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
  return (
    <Container>
            <PageMeta title="waw" description="waw" />
        <TopBar />
      <Navbar />
      <MainContainer>
                <DetailsFeature />
      </MainContainer>

            <Footer />

    </Container>
  );
};

export default Hotel;
