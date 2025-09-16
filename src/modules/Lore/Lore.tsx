import styles from "./index.module.scss";
import loreBg from "./images/lore-bg.jpg";
import vector1 from "./images/vector1.svg";
import vector2 from "./images/vector2.svg";
const Lore: React.FC = () => {
  return (
    <>
      <section id="lore" className={styles.lore}>
		<div className={styles.bg}>
        <img src={loreBg} className={`container ${styles.loreBg}`} alt="" />
		</div>
        <div className={`container ${styles.inner}`}>
          <img src={vector1} className={styles.vector1} alt="" />
          <h3 className={styles.title}>Lore</h3>
          <img src={vector2} className={styles.vector2} alt="" />
          <h5 className={`${styles.subtitle} ${styles.title}`}>
            On the edge of reality and dreams
          </h5>
          <p className={styles.text}>
            There was a street where the night never ended and the asphalt
            burned with skateboards. There, the Monicorns were born – not just
            ponies, but symbols of movement, rebellion and unity. Each has its
            own story, but together they are a family on the same wavelength.
            Legends say that the Monicorns keep the spirit of the street. They
            are not held back by walls or rules – only by the bonds of
            community. Where skateboarding turns the street into history, we
            find freedom.
          </p>
        </div>
      </section>
    </>
  );
};

export default Lore;
