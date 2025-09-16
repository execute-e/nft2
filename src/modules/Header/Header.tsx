import React, { useContext } from "react";
import styles from "./index.module.scss";
import logo from "./images/logo.svg";
import { BurgerMenuContext } from "@/context";

const Header: React.FC = () => {
  const { active, setActive } = useContext(BurgerMenuContext);

  return (
    <>
      <header className={"container " + styles.header}>
        <a href="#" className={styles.logoLink}>
          <img
            src={logo}
            alt="logo"
            className={styles.logo}
            width="42"
            height="42"
            loading="lazy"
            decoding="async"
          />
        </a>
        <nav className={styles.nav}>
          <ul className={styles.list}>
            <li className={`${styles.listItem}`}>
              <a href="#our-team" className={styles.link}>
                Our team
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="#about-us" className={styles.link}>
                About us
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="#lore" className={styles.link}>
                Lore
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="#mint-details" className={styles.link}>
                Mint details
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="#sneak-peek" className={styles.link}>
                Sneak peak
              </a>
            </li>
            <li className={styles.listItem}>
              <a href="#collabs" className={styles.link}>
                Collabs
              </a>
            </li>
          </ul>
        </nav>
        <div className={styles.buttonOverlay}>
          <button className={styles.button}>Check eligable</button>
          <button className={styles.burgerButton} onClick={() => setActive(true)} disabled={active}>
            <span className={styles.burgerButtonLine}></span>
            <span className={styles.burgerButtonLine}></span>
            <span className={styles.burgerButtonLine}></span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
