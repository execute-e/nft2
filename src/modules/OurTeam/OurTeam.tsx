import styles from "./index.module.scss";
import first from './images/1.svg';
import second from './images/2.svg';
import third from './images/3.svg';
import fourth from './images/4.svg';

const OurTeam: React.FC = () => {
  return (
    <section className={"container " + styles.ourTeam} id="our-team">
      <h2 className={styles.title}>Our Team</h2>
      <ul className={styles.teamMembers}>
        <li className={styles.member}>
          <img
            className={styles.photo}
            src={first}
          />
          <div className={styles.memberInfo}>
            <h3 className={styles.name}>CABURUS</h3>
            <p className={styles.role}>Founder / Artist</p>
          </div>
        </li>

        <li className={styles.member}>
          <img
            className={styles.photo}
            src={second}
          />
          <div className={styles.memberInfo}>
            <h3 className={styles.name}>Gabrielsosa</h3>
            <p className={styles.role}>Co - Founder / CM</p>
          </div>
        </li>

        <li className={styles.member}>
          <img
            className={styles.photo}
            src={third}
          />
          <div className={styles.memberInfo}>
            <h3 className={styles.name}>KASYAK</h3>
            <p className={styles.role}>Team / Mod</p>
          </div>
        </li>

        <li className={styles.member}>
          <img
            className={styles.photo}
            src={fourth}
          />
          <div className={styles.memberInfo}>
            <h3 className={styles.name}>Elisalim</h3>
            <p className={styles.role}>Team / Mod</p>
          </div>
        </li>
      </ul>
    </section>
  );
};
export default OurTeam;
