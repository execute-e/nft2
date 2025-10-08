import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { Images } from './images/Images'
import GradientText from '@/components/GradientText/GradientText'

const Collabs: React.FC = () => {
	const [translatedValue, setTranslatedValue] = useState(0)
	const [isAnimating, setAnimating] = useState(true)
	const [collabWidth, setCollabWidth] = useState(260)
	const carousel = useRef<HTMLUListElement>(null)

	const startAnimation = useCallback(() => {
		if (!carousel.current) return

		const translateWidth = -(
			((collabWidth + 40) * Array.from(carousel.current.children).length) /
			2
		)
		setTranslatedValue(translateWidth)
	}, [collabWidth])

	const handleTransitionEnd = (e: React.TransitionEvent<HTMLUListElement>) => {
		if (e.target === e.currentTarget) {
			setAnimating(false)
			setTranslatedValue(0)

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setAnimating(true)
				})
			})
		}
	}

	useEffect(() => {
		if (isAnimating) {
			startAnimation()
		}
	}, [isAnimating, startAnimation])

	useEffect(() => {
		const handleResize = () => {
			const windowWidth = window.innerWidth

			if (windowWidth <= 767) {
				setCollabWidth(100)
				return
			}
			if (windowWidth <= 1023) {
				setCollabWidth(160)
				return
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return (
		<section id='collabs' className={`${styles.section}`}>
			<div className={`${styles.inner}`}>
				<div className='collabs-title'>
					<GradientText
						colors={[
							'#EE6D83',
							'#f569a3ff',
							'#fb8fbcff',
							'#e64487ff',
							'#ff006aff',
						]}
						animationSpeed={3}
						showBorder={false}
						className={`container ${styles.title}`}
					>
						<h2>Collabs</h2>
					</GradientText>
				</div>

				<ul
					className={styles.carousel}
					onTransitionEnd={handleTransitionEnd}
					style={{
						transform: `translateX(${translatedValue}px)`,
						transition: isAnimating ? 'transform 40s linear' : 'none',
					}}
					ref={carousel}
				>
					<li className={styles.collab}>
						<a
							href='https://x.com/RealNadsClub'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.one}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/NadDomains'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.two}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/LaMouchNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.twelve}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/Bober_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.thirteen}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/Monadoons'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.fourteen}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/canz_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.fifteen}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/csfmly'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.sixteen}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/sealuminati'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.three}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/slmndNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.four}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/mongang_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.five}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/JikunaNft'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.six}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/monuki_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.seven}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/monadverse'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.eight}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/ChogNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.nine}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/the10kSquad'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.ten}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/DripsterNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.eleven}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/RealNadsClub'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.one}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/NadDomains'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.two}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/sealuminati'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.three}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/slmndNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.four}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/mongang_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.five}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/JikunaNft'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.six}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/monuki_xyz'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.seven}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>

					<li className={styles.collab}>
						<a
							href='https://x.com/monadverse'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.eight}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/ChogNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.nine}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/the10kSquad'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.ten}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
					<li className={styles.collab}>
						<a
							href='https://x.com/DripsterNFT'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img
								src={Images.eleven}
								alt=''
								className={styles.image}
								loading='lazy'
								decoding='async'
							/>
						</a>
					</li>
				</ul>
			</div>
		</section>
	)
}

export default Collabs
