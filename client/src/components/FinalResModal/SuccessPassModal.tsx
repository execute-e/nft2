import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.scss'
import passImage from './images/square_final.jpg'
import xIcon from './images/x.svg'
import AnimatedContent from '../AnimatedContent/AnimatedContent'
import Magnet from '../Magnet/Magnet'
import FadeContent from '../FadeContent/FadeContent'
import GradientText from '../GradientText/GradientText'

type ModalProps = {
	isOpen: boolean
	onClose: () => void
}

const SuccessWindow = ({ isOpen, onClose }: ModalProps) => {
	const handleShare = () => {
		const artURL = 'https://tenor.com/mLMbxxQY9eS.gif'

		const text = `Gmoni

I just took part in the raffle @the_monicorns on the whitelist 

Participate too https://www.monicorns.xyz

Monicorns are everywhere`

		const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			text
		)}&url=${encodeURIComponent(artURL)}`

		window.open(twitterIntentUrl, '_blank')
	}

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		if (isOpen) {
			document.documentElement.classList.add('locked')
			window.addEventListener('keydown', handleKeyDown)
		}

		return () => {
			document.documentElement.classList.remove('locked')
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
	}

	if (!isOpen) {
		return null
	}

	return ReactDOM.createPortal(
		<div
			className={styles.overlay}
			role='dialog'
			aria-modal='true'
			onClick={handleOverlayClick}
		>
			<div className={styles.content} onClick={handleContentClick}>
				<button
					className={styles.closeButton}
					onClick={onClose}
					aria-label='Close modal'
				>
					<svg width='20' height='20' viewBox='0 0 20 20' fill='none'>
						<path
							d='M15 5L5 15M5 5L15 15'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
						/>
					</svg>
				</button>

				<div className={styles.passContainer}>
					<AnimatedContent
						distance={150}
						direction='vertical'
						reverse={false}
						duration={1.2}
						ease='bounce.out'
						initialOpacity={0.2}
						animateOpacity
						scale={1.1}
						threshold={0.2}
						delay={0.1}
					>
						<h2 className={styles.title}>
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
								className={styles.gradientTitle}
							>
								The Monicorns
							</GradientText>
						</h2>
					</AnimatedContent>

					<p className={styles.subtitle}>
						Thank you for registering for the giveaway!
					</p>

					<Magnet padding={50} disabled={false} magnetStrength={15}>
						<div className={styles.imageWrapper}>
							<FadeContent>
								<img src={passImage} alt='The Monicorns Pass' />
							</FadeContent>
						</div>
					</Magnet>

					<div className={styles.textContainer}>
						<p className={styles.joinText}>
							By publishing a post about our giveaway, you'll get additional
							chances to win!
						</p>
					</div>

					<FadeContent>
						<button className={styles.shareButton} onClick={handleShare}>
							<span>Share on</span>
							<img src={xIcon} className={styles.xIcon} alt='X' />
						</button>
					</FadeContent>
				</div>
			</div>
		</div>,
		document.getElementById('portal-root') as HTMLElement
	)
}

export default SuccessWindow
