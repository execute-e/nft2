import React from 'react'
import styles from './index.module.scss'
import logo from './images/logo.svg'
import first from './images/1.png'
import second from './images/2.png'
import third from './images/3.png'
import FadeContent from '@/styles/styleComponents/FadeContent/FadeContent'

const Footer: React.FC = () => {
	return (
		<footer className={`container ${styles.footer}`}>
			<div className={styles.emptyLine}></div>
			<div className={styles.bg}>
				<div className={styles.skateboard}>
					<ul className={styles.soc1als}>
						<li className={styles.item}>
							<FadeContent>
								<a href='/' target='_blank' className={styles.link}>
									<img
										src={first}
										alt=''
										className={styles.image}
										loading='lazy'
										decoding='async'
									/>
								</a>
							</FadeContent>
						</li>
						<li className={styles.item}>
							<FadeContent>
								<a href='/' target='_blank' className={styles.link}>
									<img
										src={second}
										alt=''
										className={styles.image}
										loading='lazy'
										decoding='async'
									/>
								</a>
							</FadeContent>
						</li>
						<li className={styles.item}>
							<FadeContent>
								<a href='/' target='_blank' className={styles.link}>
									<img
										src={third}
										alt=''
										className={styles.image}
										loading='lazy'
										decoding='async'
									/>
								</a>
							</FadeContent>
						</li>
					</ul>
				</div>
			</div>
 			<div className={styles.icon}>
				<img
					src={logo}
					alt=''
					className={styles.iconImage}
					loading='lazy'
					decoding='async'
				/>
			</div>
		</footer>
	)
}

export default Footer
