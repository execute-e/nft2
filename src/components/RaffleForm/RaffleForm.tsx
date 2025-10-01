import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import styles from './index.module.scss'

// --- Type Definitions ---
type TwitterUser = {
	username: string
	id: string
}

type FormInputs = {
	discordUsername: string
	walletAddress: string
}

// --- Component ---
export const RaffleForm = () => {
	const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormInputs>({
		mode: 'onBlur',
	})

	// --- Handlers ---

	// Simulates the Twitter OAuth login flow
	const handleTwitterLogin = async () => {
		console.log('Opening Twitter auth window...')
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

		console.log('Submitting data to backend:', payload)
		await new Promise(resolve => setTimeout(resolve, 2000))

		alert(`Thank you for entering, @${payload.twitter.username}!`)
		// Here you might want to reset the form or close the modal
	}

	return (
		<div className={styles.raffleContainer}>
			{/* --- Left Panel: The Form --- */}
			<div className={styles.formPanel}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<h2 className={styles.formTitle}>Join the Giveaway</h2>
					<p className={styles.formSubtitle}>
						Complete the steps below to enter.
					</p>

					<div className={styles.inputGroup}>
						<label>Step 1: Connect Twitter</label>
						{twitterUser ? (
							<div className={styles.twitterSuccess}>
								<span>✓</span> Connected as @{twitterUser.username}
							</div>
						) : (
							<button
								type='button'
								onClick={handleTwitterLogin}
								className={styles.twitterButton}
							>
								Connect with Twitter
							</button>
						)}
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor='discord'>Step 2: Enter your Discord ID</label>
						<input
							id='discord'
							placeholder='e.g., username#1234'
							{...register('discordUsername', {
								required: 'Your Discord ID is required.',
								pattern: {
									value: /^[a-zA-Z0-9_.]{2,32}$/,
									message: 'Invalid format. Example: username#1234',
								},
							})}
						/>
						{errors.discordUsername && (
							<p className={styles.error}>{errors.discordUsername.message}</p>
						)}
					</div>

					<div className={styles.inputGroup}>
						<label htmlFor='wallet'>Step 3: Provide your Wallet Address</label>
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

			{/* --- Right Panel: Information & Art --- */}
			<div className={styles.infoPanel}>
				<div className={styles.infoContent}>
					<h3>A quick heads-up!</h3>
					<p>
						Joining our Discord is a mandatory step. Winners will be verified,
						so make sure you're in the community!
					</p>
					<a
						href='https://discord.com/' // Replace with your actual Discord invite link
						target='_blank'
						rel='noopener noreferrer'
						className={styles.discordLinkButton}
					>
						Join Discord Now
					</a>
				</div>
			</div>
		</div>
	)
}

export default RaffleForm