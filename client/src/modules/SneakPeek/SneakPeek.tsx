import React from 'react'
import styles from './index.module.scss'
import firstImg from './images/first_compressed.webp'
import secondImg from './images/second_compressed.webp'
import thirdImg from './images/third_compressed.webp'
import fourthImg from './images/fourth_compressed.webp'
import fifthImg from './images/fifth_compressed.webp'
import sixthImg from './images/sixth_compressed.webp'
import seventhImg from './images/seventh_compressed.webp'
import eighthImg from './images/eighth_compressed.webp'

const SneakPeek: React.FC = () => {
	return (
		<section id='sneak-peek' className={styles.section}>
			<div className={styles.ellipse}>
				<h2 className={styles.title}>Sneak peek</h2>
				<div className={styles.leftGroup}>
					<img
						src={firstImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
					<img
						src={fifthImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
				</div>
				<div className={styles.centerGroup}>
					<img
						src={secondImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
					<img
						src={thirdImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
					<img
						src={sixthImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
					<img
						src={seventhImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
				</div>
				<div className={styles.rightGroup}>
					<img
						src={fourthImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
					<img
						src={eighthImg}
						alt=''
						className={styles.img}
						width='236'
						height='236'
						loading='lazy'
						decoding='async'
					/>
				</div>
			</div>
		</section>
	)
}

export default SneakPeek
