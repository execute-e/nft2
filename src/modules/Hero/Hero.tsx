import React from "react";
import firstVector from "./images/vector1.svg";
import secondVector from "./images/vector2.svg";
import styles from "./index.module.scss";

const Hero: React.FC = () => {
  return (
    <section id="hero" className={"container " + styles.hero}>
      <div className={styles.image}></div>
      <div className={styles.info}>
        <button className={styles.button}>Check eligable</button>
        <p id="about-us" className={styles.text}>
          Welcome to a place where the asphalt burns with skateboards and the
          air is filled with dreams — this is the Monicorns family. The idea of
          Monicorns came from a simple thought: what if you combine ponies,
          magic, and the streets? Out of that spark, a whole concept was born.
          Monicorns were created not with thergoal of making just another NFT,
          but to build a movement and go through the process of forming an
          entire community. At the heart of the project is a team that has given
          a part of itself to create something greater — a family
        </p>
        <div className={styles.titleGroup}>
          <img
            src={firstVector}
            alt=""
            height="40"
            loading="lazy"
            decoding="async"
          />
          <h1 className={styles.title}>The Monicorns</h1>
          <img
            src={secondVector}
            alt=""
            height="40"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
