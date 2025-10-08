import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import GradientText from '../GradientText/GradientText'

type Winner = {
	twitter_id: string
	discord_username: string
	wallet_address: string
}

const fetchWinners = async (): Promise<Winner[]> => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/raffle/winners`
		)
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			throw new Error(errorData.error || 'Failed to fetch winners list')
		}

		const winnersData = await response.json()

		return winnersData || []
	} catch (error) {
		console.error('Error fetching winners:', error)
		return []
	}
}

const WinnersTable = () => {
	const [winners, setWinners] = useState<Winner[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchWinners()
			.then(data => {
				setWinners(data)
			})
			.catch(err => {
				setError(err.message || 'Unknown error')
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])

	if (isLoading) {
		return <div className={styles.loading}>Request in progress...⏳</div>
	}

	if (error) {
		return <div className={styles.error}>Error: {error} 😞</div>
	}

	if (winners.length === 0) {
		return (
			<div className={styles.empty}>
				The results in the GA winners table have not been released yet.
			</div>
		)
	}

	return (
		<>
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
					className={styles.title}
				>
					🏆 GA Winners! 🏆
				</GradientText>
			</h2>
			<div className={styles.contentWrapper}>
				<table className={styles.WinnersTable}>
					<thead>
						<tr>
							<th>Twitter</th>
							<th>Discord</th>
							<th>Wallet Address</th>
						</tr>
					</thead>
					<tbody>
						{winners.map(winner => (
							<tr key={winner.twitter_id}>
								<td>
									<a
										href={`https://twitter.com/${winner.twitter_id.replace(
											'@',
											''
										)}`}
										target='_blank'
										rel='noopener noreferrer'
									>
										{winner.twitter_id}
									</a>
								</td>
								<td>{winner.wallet_address}</td>
								<td>{winner.discord_username}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default WinnersTable
