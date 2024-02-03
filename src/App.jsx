import React, { useState } from "react";
import styled from "styled-components";

import Menu from "./Menu.jsx";
import Viewer from "./Viewer.jsx";

const Main = styled.div`
  display: grid;
  position: relative;

  grid-template:
    "nav nav" 30px
    "menu main" calc(100vh - 30px - 4rem) / 280px auto;

  height: 100vh;
  width: 100%;
  padding: 1rem 2rem 0.5rem 2rem;
  grid-gap: 1rem;

  @media (max-width: 500px) {
    height: auto;
    grid-template:
      "nav" 30px
      "main" 
        "menu" ;
  }


  & > :first-child {
    grid-area: nav;
    display: flex;
    align-items: flex-end;
    & > :first-child {
      margin-right: 0.5em;
    }
  }

  & > :nth-child(2) {
    overflow-y: auto;
    @media (max-width: 500px) {
      overflow-y: hidden;
    }
    grid-area: menu;
  }

  & > :nth-child(3) {
    grid-area: main;

  & > :nth-child(4) {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;

  font-size: 0.6em;
  font-weight: 400;
  color: var(--color);

  & > a {
    text-decoration: none;
    color: var(--color);
  }

  & > :not(:first-child) {
    margin-left: 1em;
  }
`;

export default React.memo(function ReplicadApp() {
  return (
    <>
      <Main>
        <div>
          <span>Honeycomb Storage Wall</span>
        </div>
        <Menu />
        <Viewer />
        <Footer>
          <a
            href="https://github.com/sgenoud/replicad-honeycomb"
            target="_blank"
          >
            GitHub
          </a>
          <a href="mailto:steve@sgenoud.com" target="_blank">
            Email
          </a>
          <a href="https://carrots.sgenoud.com/" target="_blank">
            Blog
          </a>
          <a href="https://toot.cafe/stevegenoud" target="_blank">
            Mastodon
          </a>
        </Footer>
      </Main>
    </>
  );
});
