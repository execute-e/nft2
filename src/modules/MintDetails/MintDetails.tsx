import GradientText from '@/components/GradientText/GradientText'
import styles from './index.module.scss'
import Magnet from '@/components/Magnet/Magnet'

const MintDetails: React.FC = () => {
	return (
		<section className={'container ' + styles.mintDetails} id='mint-details'>
			<GradientText
				colors={['#EE6D83', '#f569a3ff', '#fb8fbcff', '#e64487ff', '#ff006aff']}
				animationSpeed={3}
				showBorder={false}
				className={styles.title}
			>
				<h3>Mint Details</h3>
			</GradientText>
			<ul className={styles.cardInfo}>
				<Magnet padding={50} disabled={false} magnetStrength={15}>
					<li className={styles.cardItem}>
						<h3 className={styles.cardTitle}>Supply</h3>
						<p className={styles.cardText}>2222 NFTS</p>
					</li>
				</Magnet>
				<Magnet padding={50} disabled={false} magnetStrength={15}>
					<li className={styles.cardItem}>
						<h3 className={styles.cardTitle}>RARITY</h3>
						<p className={styles.cardText}>4 unique tiers</p>
					</li>
				</Magnet>
				<Magnet padding={50} disabled={false} magnetStrength={15}>
					<li className={styles.cardItem}>
						<h3 className={styles.cardTitle}>UTILITY</h3>
						<p className={styles.cardText}>Merch? Token? Giveaways?</p>
					</li>
				</Magnet>
				<Magnet padding={50} disabled={false} magnetStrength={15}>
					<li className={styles.cardItem}>
						<h3 className={styles.cardTitle}>MINT PRICE</h3>
						<p className={styles.cardText}>TBA</p>
					</li>
				</Magnet>
			</ul>
		</section>
	)
}

export default MintDetails
