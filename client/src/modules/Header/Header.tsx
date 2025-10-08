import React, { useContext, useState, useEffect } from 'react'
import styles from './index.module.scss'
import logo from './images/logo.svg'
import { BurgerMenuContext } from '@/context'
import GradientText from '@/components/GradientText/GradientText'
import Magnet from '@/components/Magnet/Magnet'
import ModalWindow from '@/components/ModalWindow/ModalWindow'
import RaffleForm from '@/components/RaffleForm/RaffleForm'
import WinnersTable from '@/components/WinnersTable/WinnersTable'
import SuccessWindow from '@/components/FinalResModal/SuccessPassModal'

type TwitterUser = {
	username: string
	id: string
}

const Header: React.FC = () => {
	const { active, setActive } = useContext(BurgerMenuContext)
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [isOpenW, setIsOpenW] = useState<boolean>(false)
	const [isOpenS, setIsOpenS] = useState<boolean>(false)
	const [initialTwitterUser, setInitialTwitterUser] =
		useState<TwitterUser | null>(null)
	useEffect(() => {
		const checkAuthAndOpenModal = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/auth/twitter/status`,
					{
						credentials: 'include',
					}
				)

				if (response.ok) {
					const userData = await response.json()
					// Сохраняем данные пользователя, чтобы передать их в форму
					setInitialTwitterUser({
						username: userData.TwitterUsername,
						id: userData.TwitterID,
					})
					setIsOpen(true)
				}
			} catch (error) {
				// console.error('User not logged in on initial load:', error)
			}
		}

		checkAuthAndOpenModal()
	}, [])

	const handleRaffleSuccess = () => {
		// console.log(`Result: ${result}`)
		setIsOpen(false)
		setIsOpenS(true)
	}

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
						{/* <li className={styles.listItem}>
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
						</li> */}
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
						<li className={styles.listItem}>
							<a onClick={() => setIsOpenW(true)} className={styles.link}>
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
										Winners
									</GradientText>
								</Magnet>
							</a>
						</li>
						<li className={styles.listItem}>
							<a onClick={() => setIsOpenS(true)} className={styles.link}>
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
										Share
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
						<RaffleForm
							initialTwitterUser={initialTwitterUser}
							onSubmitSuccess={handleRaffleSuccess}
						/>
					</ModalWindow>

					<ModalWindow isOpen={isOpenW} onClose={() => setIsOpenW(false)}>
						<WinnersTable />
					</ModalWindow>

					<SuccessWindow
						isOpen={isOpenS}
						onClose={() => setIsOpenS(false)}
					></SuccessWindow>

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
