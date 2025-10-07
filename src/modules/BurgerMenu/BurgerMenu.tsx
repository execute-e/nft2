import React, { useContext, useState } from 'react'
import styles from './index.module.scss'
import secondVector from './images/vector2.svg'
import { BurgerMenuContext } from '@/context'
import WinnersTable from '@/components/WinnersTable/WinnersTable'
import ModalWindow from '@/components/ModalWindow/ModalWindow'

const BurgerMenu: React.FC = () => {
	const { active, setActive } = useContext(BurgerMenuContext)
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleClose = () => {
		setActive(false)
	}

	return (
		<div className={`${styles.burgerMenu} ${active ? styles.active : ''}`}>
			<div className={styles.titleOverlay}>
				<h1 className={styles.title}>The monicorns</h1>
				<img src={secondVector} alt='' loading='lazy' decoding='async' />
			</div>
			<nav className={styles.nav}>
				<ul className={styles.list}>
					<li className={styles.item}>
						<a href='#our-team' className={styles.link} onClick={handleClose}>
							Our team
						</a>
					</li>
					<li className={styles.item}>
						<a href='#about-us' className={styles.link} onClick={handleClose}>
							About us
						</a>
					</li>
					<li className={styles.item}>
						<a href='#lore' className={styles.link} onClick={handleClose}>
							Lore
						</a>
					</li>
					<li className={styles.item}>
						<a
							href='#mint-details'
							className={styles.link}
							onClick={handleClose}
						>
							Mint details
						</a>
					</li>
					<li className={styles.item}>
						<a href='#sneak-peek' className={styles.link} onClick={handleClose}>
							Sneak Peek
						</a>
					</li>
					<li className={styles.item}>
						<a href='#collabs' className={styles.link} onClick={handleClose}>
							Collabs
						</a>
					</li>
					<li className={styles.item}>
						<a className={styles.link} onClick={() => setIsOpen(true)}>
							GA Winners
						</a>
					</li>
				</ul>
			</nav>
			<ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<WinnersTable />
			</ModalWindow>
			<button
				className={styles.button}
				onClick={handleClose}
				disabled={!active}
			>
				<div className={styles.buttonIcon}>
					<span className={styles.buttonLine}></span>
					<span className={styles.buttonLine}></span>
				</div>
			</button>
		</div>
	)
}

export default BurgerMenu
