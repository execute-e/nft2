import styles from './index.module.scss'

const MintDetails: React.FC = () => {
	return (
		<section className={'container ' + styles.mintDetails} id='mint-details'>
			<h2 className={styles.title}>Mint Details</h2>
			<ul className={styles.cardInfo}>
				<li className={styles.cardItem}>
					<h3 className={styles.cardTitle}>Supply</h3>
					<p className={styles.cardText}>2222 NFTS</p>
				</li>
				<li className={styles.cardItem}>
					<h3 className={styles.cardTitle}>RARITY</h3>
					<p className={styles.cardText}>4 unique tiers</p>
				</li>
				<li className={styles.cardItem}>
					<h3 className={styles.cardTitle}>UTILITY</h3>
					<p className={styles.cardText}>Merch? Token? Giveaways?</p>
				</li>
				<li className={styles.cardItem}>
					<h3 className={styles.cardTitle}>MINT PRICE</h3>
					<p className={styles.cardText}>TBA</p>
				</li>
			</ul>
		</section>
	)
}

export default MintDetails
