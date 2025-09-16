import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { Images } from "./images/Images";

const Collabs: React.FC = () => {
  const [translatedValue, setTranslatedValue] = useState(0);
  const [isAnimating, setAnimating] = useState(true);
  const [collabWidth, setCollabWidth] = useState(260);
  const carousel = useRef<HTMLUListElement>(null);

  const startAnimation = useCallback(() => {
    if (!carousel.current) return;

    const translateWidth = -(
      ((collabWidth + 40) * Array.from(carousel.current.children).length) /
      2
    );
    setTranslatedValue(translateWidth);
  }, [collabWidth]);

  const handleTransitionEnd = () => {
    setAnimating(false);
    setTranslatedValue(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(true);
      });
    });
  };

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    }
  }, [isAnimating, startAnimation]);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 767) {
        setCollabWidth(100);
        return;
      }
      if (windowWidth <= 1023) {
        setCollabWidth(160);
        return;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="collabs" className={`${styles.section}`}>
      <div className={`${styles.inner}`}>
        <h2 className={`container ${styles.title}`}>Collabs</h2>
        <ul
          className={styles.carousel}
          onTransitionEnd={handleTransitionEnd}
          style={{
            translate: `${translatedValue}px`,
            transition: isAnimating ? "translate 20s linear" : "none",
          }}
          ref={carousel}
        >
          <li className={styles.collab}>
            <img
              src={Images.one}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.two}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.three}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.four}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.five}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.six}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.seven}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.eight}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.nine}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.ten}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.eleven}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.one}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.two}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.three}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.four}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.five}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.six}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.seven}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.eight}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.nine}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.ten}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
          <li className={styles.collab}>
            <img
              src={Images.eleven}
              alt=""
              className={styles.image}
              loading="lazy"
              decoding="async"
            />
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Collabs;
