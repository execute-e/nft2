import React from 'react'
import styles from './index.module.scss'
import logo from './images/logo.svg'
import first from './images/1.webp'
import second from './images/2.webp'
import third from './images/3.webp'
import FadeContent from '@/components/FadeContent/FadeContent'

const Footer: React.FC = () => {
	return (
		<footer className={`container ${styles.footer}`}>
			<div className={styles.emptyLine}></div>
			<div className={styles.bg}>
				<div className={styles.skateboard}>
					<ul className={styles.soc1als}>
						<li className={styles.item}>
							<FadeContent>
								<a
									href='https://magiceden.io/collections/monad-testnet/0xaf1077066c35dc03b079881c51d4f5f8c25ade65'
									target='_blank'
									className={styles.link}
								>
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
								<a
									href='https://x.com/the_monicorns'
									target='_blank'
									className={styles.link}
								>
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
								<a
									href='https://discord.gg/the-monicorns'
									target='_blank'
									className={styles.link}
								>
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
