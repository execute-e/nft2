import { useState, useEffect } from 'react'
import styles from './index.module.scss'
import GradientText from '../GradientText/GradientText'

type Winner = {
	id: string | number
	twitterUsername: string
	walletAddress: string
}

// --- Мок-функция для имитации запроса к серверу ---
// ЗАМЕНИТЕ ЭТОТ КОД РЕАЛЬНЫМ ЗАПРОСОМ К ВАШЕМУ API
const fetchWinners = async (): Promise<Winner[]> => {
	console.log('Fetching data...')
	await new Promise(resolve => setTimeout(resolve, 1000))
	return [
		{
			id: 1,
			twitterUsername: '@elonmusk',
			walletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
		},
		{
			id: 2,
			twitterUsername: '@vitalikbuterin',
			walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		},
		{
			id: 3,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 4,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 5,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 6,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 7,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 8,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 9,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 10,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 11,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 12,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 13,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
		{
			id: 14,
			twitterUsername: '@jack',
			walletAddress: '0x1c58438dA1EaD683f26A396B25921f7ad8243F28',
		},
	]
}
// ----------------------------------------------------

const WinnersTable = () => {
	const [winners, setWinners] = useState<Winner[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		// Запрос отправляется один раз при монтировании компонента
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
	}, []) // Пустой массив зависимостей означает "выполнить один раз"

	if (isLoading) {
		return <div className={styles.loading}>Request in progress...⏳</div>
	}

	if (error) {
		return <div className={styles.error}>Error: {error} 😞</div>
	}

	if (winners.length === 0) {
		return <div className={styles.empty}>GA Winners table is empty</div>
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
							<th>ID</th>
							<th>Twitter</th>
							<th>Wallet Address</th>
						</tr>
					</thead>
					<tbody>
						{winners.map(winner => (
							<tr key={winner.id}>
								<td>{winner.id}</td>
								<td>
									<a
										href={`https://twitter.com/${winner.twitterUsername.replace(
											'@',
											''
										)}`}
										target='_blank'
										rel='noopener noreferrer'
									>
										{winner.twitterUsername}
									</a>
								</td>
								<td>{winner.walletAddress}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default WinnersTable
