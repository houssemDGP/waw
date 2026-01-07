import React from "react";
import styled from "styled-components";
  import {
    Typography
  } from '@mui/material';
const SectionWrapper = styled.div`
  margin: 2rem 0;

  .title {
    font-family: Poppins, sans-serif;
    font-weight: 700;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .title span {
    font-family: "Rock Salt", cursive;
    font-weight: 400;
  }

  .subtitle {
    font-size: 1rem;
    color: #555;
    margin-bottom: 2rem;
  }

  .grid-layout {
    display: grid;
    grid-template-areas:
      "left top1 top2 right"
      "left mid1 mid2 right";
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;

    @media (max-width: 992px) {
      grid-template-areas:
        "left top1"
        "left top2"
        "right mid1"
        "right mid2";
      grid-template-columns: 1fr 1fr;
    }

    @media (max-width: 600px) {
      grid-template-areas:
        "left"
        "top1"
        "top2"
        "mid1"
        "mid2"
        "right";
      grid-template-columns: 1fr;
    }
  }

  .item {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    min-height: 200px;
  }

  .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .item:hover img {
    transform: scale(1.05);
  }

  figcaption {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0.8rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
    color: white;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.2;
  }

  .left {
    grid-area: left;
  }

  .right {
    grid-area: right;
  }

  .top1 {
    grid-area: top1;
  }

  .top2 {
    grid-area: top2;
  }

  .mid1 {
    grid-area: mid1;
  }

  .mid2 {
    grid-area: mid2;
  }
`;

const blogPosts = [
  {
    img: "https://waw.com.tn/uploads/blog/hammamet.png",
    caption: "Les plus beaux escape games en plein air à Tunis et Hammamet",
    className: "left"
  },
  {
    img: "https://waw.com.tn/uploads/blog/father'sday.png",
    caption: "Fête des pères : idées de sorties originales en Tunisie",
    className: "top1"
  },
  {
    img: "https://waw.com.tn/uploads/blog/tabarka.png",
    caption: "Week-end de Pâques : activités familiales à Bizerte et Tabarka",
    className: "top2"
  },
  {
    img: "https://waw.com.tn/uploads/blog/sousse.png",
    caption: "EVJF à Sousse : 6 idées fun pour un week-end inoubliable",
    className: "mid1"
  },
  {
    img: "https://waw.com.tn/uploads/blog/mahdia.png",
    caption: "Fête des mères : moments magiques au bord de la mer à Mahdia",
    className: "mid2"
  },
  {
    img: "https://waw.com.tn/uploads/blog/activitésadjerba.png",
    caption: "7 activités incontournables à faire en famille à Djerba",
    className: "right"
  }
];



export default function BlogGrid() {
  return (
    <SectionWrapper>

              <center>
<Typography
  variant="h5"
          sx={{ color: "#181AD6", fontWeight: "bold", flexGrow: 1, textAlign: "center" ,marginTop:"50px",fontSize: "35px"}}
>
Découvrez notre Blog
</Typography>
  </center>
      <div className="grid-layout">
        {blogPosts.map((post, index) => (
          <figure className={`item ${post.className}`} key={index}>
            <a target="_blank" rel="noopener noreferrer">
              <img src={post.img} alt={post.caption} height="250px" />
              <figcaption>{post.caption}</figcaption>
            </a>
          </figure>
        ))}
      </div>
    </SectionWrapper>
  );
}
