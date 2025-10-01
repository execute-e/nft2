import React, { useContext, useState } from 'react'
import styles from './index.module.scss'
import logo from './images/logo.svg'
import { BurgerMenuContext } from '@/context'
import GradientText from '@/components/GradientText/GradientText'
import Magnet from '@/components/Magnet/Magnet'
import ModalWindow from '@/components/ModalWindow/ModalWindow'
import RaffleForm from '@/components/RaffleForm/RaffleForm'

const Header: React.FC = () => {
	const { active, setActive } = useContext(BurgerMenuContext)
	const [isOpen, setIsOpen] = useState<boolean>(false)

	return (
		<>
			<header className={'container ' + styles.header}>
				<a href='#' className={styles.logoLink}>
					<img
						src={logo}
						alt='logo'
						className={styles.logo}
						width='42'
						height='42'
						loading='lazy'
						decoding='async'
					/>
				</a>
				<nav className={styles.nav}>
					<ul className={styles.list}>
						<li className={`${styles.listItem}`}>
							<a href='#our-team' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										Our team
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a href='#about-us' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										About us
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a href='#lore' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										Lore
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a href='#mint-details' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										Mint details
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a href='#sneak-peek' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										Sneak peek
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a href='#collabs' className={styles.link}>
								<Magnet padding={50} disabled={false} magnetStrength={15}>
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
										className={styles.title}
									>
										Collabs
									</GradientText>
								</Magnet>
							</a>
						</li>
					</ul>
				</nav>
				<div className={styles.buttonOverlay}>
					<Magnet padding={50} disabled={false} magnetStrength={15}>
						<button onClick={() => setIsOpen(true)} className={styles.button}>
							Check eligable
						</button>
					</Magnet>

					<ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
						<RaffleForm />
					</ModalWindow>

					<button
						className={styles.burgerButton}
						onClick={() => setActive(true)}
						disabled={active}
					>
						<span className={styles.burgerButtonLine}></span>
						<span className={styles.burgerButtonLine}></span>
						<span className={styles.burgerButtonLine}></span>
					</button>
				</div>
			</header>
		</>
	)
}

export default Header
