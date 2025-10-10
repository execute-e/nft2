import React from 'react'
import styles from './index.module.scss'
import firstImg from './images/first.webp'
import secondImg from './images/second.webp'
import thirdImg from './images/third.webp'
import fourthImg from './images/fourth.webp'
import fifthImg from './images/fifth.webp'
import sixthImg from './images/sixth.webp'
import seventhImg from './images/seventh.webp'
import eighthImg from './images/eighth.webp'

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
