import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const BASE_URL = "https://waw.com.tn";

const Container = styled.div`
  margin: 1rem 0;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  min-height: 500px;

  @media (max-width: 992px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const Col = styled.div`
  flex: ${({ isText }) => (isText ? "2 1 66.66%" : "1 1 33.33%")};
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align || "flex-start"};
  padding: 0 1rem;

  @media (max-width: 992px) {
    flex: 1 1 100%;
    padding: 0;
    margin-top: 1rem;
  }
`;

const TitleContainer = styled.div`
  color: black;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  a {
    text-decoration: none;
  }

  button {
    padding: 0.75rem 1rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: black;
    }
  }
`;

const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 1rem;
`;

const SliderTrack = styled.div`
  display: flex;
  justify-content: center; /* centre les images */
  transition: transform 0.5s ease;
  transform: ${({ index }) => `translateX(-${index * 120}px)`}; /* défile image par image */
`;

const Slide = styled.div`
  flex: 0 0 auto;
  width: 120px;   /* largeur fixe */
  max-width: 120px;
  margin: 0 10px; /* petit espace entre les vignettes */
`;

const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  cursor: pointer;
  object-fit: cover;

  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  }

  ${({ selected }) =>
    selected &&
    `
    border: 3px solid black;
    transform: scale(1.1);
  `}
`;


const Arrow = styled.button`
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background: black;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 20px;
  z-index: 2;

  ${({ left }) => (left ? "left: 10px;" : "right: 10px;")}

  &:hover {
    background: black;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const SelectedImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 16px;
  margin: 0 auto;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 992px) {
    max-width: 300px;
  }
`;

export default function ReservationDynamic() {
  const [articles, setArticles] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [sliderIndex, setSliderIndex] = useState({}); // index par article

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/articleindex`)
      .then((res) => setArticles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelect = (articleId, imgUrl) => {
    setSelectedImages((prev) => ({ ...prev, [articleId]: imgUrl }));
  };
const handlePrev = (articleId, total) => {
  setSliderIndex((prev) => ({
    ...prev,
    [articleId]:
      prev[articleId] > 0 ? prev[articleId] - 1 : total - 1, // recule image par image
  }));
};

const handleNext = (articleId, total) => {
  setSliderIndex((prev) => ({
    ...prev,
    [articleId]:
      prev[articleId] < total - 1 ? prev[articleId] + 1 : 0, // avance image par image
  }));
};


  return (
    <Container>
      <link
        href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap"
        rel="stylesheet"
      />

      {articles.map((article, index) => {
        const isEven = index % 2 === 0;
        const images = article.imageUrls || [];
        const selectedImg =
          selectedImages[article.id] ||
          (images.length > 0 ? `${BASE_URL}${images[0]}` : "");
        const currentIndex = sliderIndex[article.id] || 0;

        return (
          <Row key={article.id}>
            {isEven ? (
              <>
                <Col isText>
                  <TitleContainer>{article.titre}</TitleContainer>
                  <div>{article.description}</div>

                  {images.length > 1 && (
                    <SliderWrapper>
                      <Arrow left onClick={() => handlePrev(article.id, images.length)}>‹</Arrow>
                      <SliderTrack index={currentIndex}>
                        {images.map((img, idx) => (
                          <Slide key={idx}>
                            <Thumbnail
                              src={`${BASE_URL}${img}`}
                              alt={`${article.titre}-${idx}`}
                              onClick={() =>
                                handleSelect(article.id, `${BASE_URL}${img}`)
                              }
                              selected={selectedImg === `${BASE_URL}${img}`}
                            />
                          </Slide>
                        ))}
                      </SliderTrack>
                      <Arrow onClick={() => handleNext(article.id, images.length)}>›</Arrow>
                    </SliderWrapper>
                  )}

                  {article.link && (
                    <ButtonContainer>
                      <a href={article.link}>
                        <button>Je découvre</button>
                      </a>
                    </ButtonContainer>
                  )}
                </Col>

                <Col align="end">
                  {selectedImg && (
                    <SelectedImage src={selectedImg} alt={article.titre} />
                  )}
                </Col>
              </>
            ) : (
              <>
                <Col align="start">
                  {selectedImg && (
                    <SelectedImage src={selectedImg} alt={article.titre} />
                  )}
                </Col>

                <Col isText>
                  <TitleContainer>{article.titre}</TitleContainer>
                  <div>{article.description}</div>

                  {images.length > 1 && (
                    <SliderWrapper>
                      <Arrow left onClick={() => handlePrev(article.id, images.length)}>‹</Arrow>
                      <SliderTrack index={currentIndex}>
                        {images.map((img, idx) => (
                          <Slide key={idx}>
                            <Thumbnail
                              src={`${BASE_URL}${img}`}
                              alt={`${article.titre}-${idx}`}
                              onClick={() =>
                                handleSelect(article.id, `${BASE_URL}${img}`)
                              }
                              selected={selectedImg === `${BASE_URL}${img}`}
                            />
                          </Slide>
                        ))}
                      </SliderTrack>
                      <Arrow onClick={() => handleNext(article.id, images.length)}>›</Arrow>
                    </SliderWrapper>
                  )}

                  {article.link && (
                    <ButtonContainer>
                      <a href={article.link}>
                        <button>Je découvre</button>
                      </a>
                    </ButtonContainer>
                  )}
                </Col>
              </>
            )}
          </Row>
        );
      })}
    </Container>
  );
}
