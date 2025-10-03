import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import styles from './index.module.scss'
import xIcon from './images/x.svg'

type TwitterUser = {
	username: string
	id: string
}

type FormInputs = {
	discordUsername: string
	walletAddress: string
}

interface RaffleFormProps {
	imageUrl?: string
	onSubmitSuccess?: (data: any) => void
}

// --- Component ---
export const RaffleForm = ({ imageUrl, onSubmitSuccess }: RaffleFormProps) => {
	const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<FormInputs>({
		mode: 'onBlur',
	})

	// --- Handlers ---

	const handleTwitterLogin = async () => {
		console.log('Opening Twitter auth window...')
		// TODO: Подключить реальный OAuth Twitter
		await new Promise(resolve => setTimeout(resolve, 1500))
		setTwitterUser({ username: 'gemini_dev', id: '54321' })
		console.log('Twitter login successful!')
	}

	// Handles the final form submission
	const onSubmit: SubmitHandler<FormInputs> = async data => {
		if (!twitterUser) {
			alert('Please connect your Twitter account first.')
			return
		}

		const payload = {
			twitter: twitterUser,
			discord: data.discordUsername,
			wallet: data.walletAddress,
		}

		try {
			console.log('Submitting data to backend:', payload)

			// TODO: Заменить на реальный API запрос
			// const response = await fetch('/api/raffle/submit', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(payload)
			// })
			// const result = await response.json()

			await new Promise(resolve => setTimeout(resolve, 2000))

			alert(`Thank you for entering, @${payload.twitter.username}!`)

			// Вызываем callback если передан
			if (onSubmitSuccess) {
				onSubmitSuccess(payload)
			}

			// Опционально: сброс формы после успешной отправки
			reset()
			setTwitterUser(null)
		} catch (error) {
			console.error('Submission error:', error)
			alert('Something went wrong. Please try again.')
		}
	}

	return (
		<div className={styles.raffleContainer}>
			<div className={styles.formPanel}>
				<div className={styles.formOverlay}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<h2 className={styles.formTitle}>Join the Giveaway</h2>
						<p className={styles.formSubtitle}>
							Complete the steps below to enter.
						</p>

						<div className={styles.inputGroup}>
							<label>Step 1: Log in via X</label>
							{twitterUser ? (
								<div className={styles.twitterSuccess}>
									<span className={styles.checkmark}>✓</span> Connected as @
									{twitterUser.username}
								</div>
							) : (
								<button
									type='button'
									onClick={handleTwitterLogin}
									className={styles.twitterButton}
								>
									Connect with <img src={xIcon} alt='X' />
								</button>
							)}
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor='discord'>
								Step 2: Enter your Discord nickname
							</label>
							<input
								id='discord'
								placeholder='e.g., liteplay2'
								{...register('discordUsername', {
									required: 'Your Discord nickname is required.',
									pattern: {
										value: /^[a-zA-Z0-9_.]{2,32}$/,
										message: 'Invalid format. Example: liteplay2',
									},
								})}
							/>
							{errors.discordUsername && (
								<p className={styles.error}>{errors.discordUsername.message}</p>
							)}
						</div>

						<div className={styles.inputGroup}>
							<label htmlFor='wallet'>
								Step 3: Provide your Wallet Address
							</label>
							<input
								id='wallet'
								placeholder='0x...'
								{...register('walletAddress', {
									required: 'A wallet address is required.',
									pattern: {
										value: /^0x[a-fA-F0-9]{40}$/,
										message: 'Invalid wallet address format.',
									},
								})}
							/>
							{errors.walletAddress && (
								<p className={styles.error}>{errors.walletAddress.message}</p>
							)}
						</div>

						<button
							type='submit'
							disabled={isSubmitting}
							className={styles.submitButton}
						>
							{isSubmitting ? 'Submitting...' : 'Enter Giveaway'}
						</button>
					</form>
				</div>
			</div>

			{/* --- Right Panel: Information & Art --- */}
			<div className={styles.infoPanel}>
				{imageUrl && (
					<div className={styles.imageContainer}>
						<img
							src={imageUrl}
							alt='Giveaway art'
							className={styles.infoPanelImage}
						/>
					</div>
				)}
				<div className={styles.infoContent}>
					<h3>A quick heads-up!</h3>
					<p>
						Joining our Discord is a mandatory step. Winners will be verified,
						so make sure you're in the community!
					</p>
					<a
						href='https://discord.gg/the-monicorns'
						target='_blank'
						rel='noopener noreferrer'
						className={styles.discordLinkButton}
					>
						Join Discord Now
					</a>
					<p>Or check the winners results!</p>
					<a
						href='https://discord.gg/the-monicorns'
						target='_blank'
						rel='noopener noreferrer'
						className={styles.discordLinkButton}
					>
						Open Winners Table
					</a>
				</div>
			</div>
		</div>
	)
}

export default RaffleForm
