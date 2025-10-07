import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import styles from './index.module.scss'
import xIcon from './images/x.svg'
import ModalWindow from '../ModalWindow/ModalWindow'
import WinnersTable from '../WinnersTable/WinnersTable'
import SuccessWindow from '../FinalResModal/SuccessPassModal'

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
	initialTwitterUser?: TwitterUser | null
}

export const RaffleForm = ({
	imageUrl,
	onSubmitSuccess,
	initialTwitterUser,
}: RaffleFormProps) => {
	const [twitterUser, setTwitterUser] = useState<TwitterUser | null>(
		initialTwitterUser || null
	)
	const [submissionError, setSubmissionError] = useState<string | null>(null)
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false)

	const savedData = sessionStorage.getItem('raffleFormData')
	const initialValues = savedData
		? JSON.parse(savedData)
		: { discordUsername: '', walletAddress: '' }

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<FormInputs>({
		defaultValues: initialValues,
	})

	const [isOpen, setIsOpen] = useState<boolean>(false)

	useEffect(() => {
		if (initialTwitterUser) {
			setTwitterUser(initialTwitterUser)
		}
	}, [initialTwitterUser])

	useEffect(() => {
		const subscription = watch(value => {
			sessionStorage.setItem('raffleFormData', JSON.stringify(value))
		})
		return () => subscription.unsubscribe()
	}, [watch])


	const handleTwitterLogin = () => {
		const returnPath = window.location.pathname
		const loginUrl = `http://localhost:8080/auth/twitter/login?redirect_to=${encodeURIComponent(
			// TODO: заменить на реальный URL
			returnPath
		)}`
		window.location.href = loginUrl
	}

	const onSubmit: SubmitHandler<FormInputs> = async data => {
		setSubmissionError(null)

		if (!twitterUser) {
			alert('Please connect your Twitter account first.')
			return
		}

		try {
			const response = await fetch('http://localhost:8080/raffle/register', {
				// TODO: заменить на реальный URL
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					discord_username: data.discordUsername,
					wallet_address: data.walletAddress,
				}),
			})

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'An unknown error occurred')
			}

			const result = await response.json()

			if (onSubmitSuccess) {
				onSubmitSuccess(result)
			}

			sessionStorage.removeItem('raffleFormData')
			reset()
			setTwitterUser(null)
		} catch (error: any) {
			// console.error('Submission error:', error)
			setSubmissionError(error.message)
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
						{submissionError && (
							<p className={styles.submissionError}>{submissionError}</p>
						)}
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
					<p>Or check the GA winners results!</p>
					<a
						onClick={() => setIsOpen(true)}
						rel='noopener noreferrer'
						className={styles.discordLinkButton}
					>
						Open Winners Table
					</a>
					<ModalWindow isOpen={isOpen} onClose={() => setIsOpen(false)}>
						<WinnersTable />
					</ModalWindow>

					<SuccessWindow
						isOpen={isSuccessModalOpen}
						onClose={() => setIsSuccessModalOpen(false)}
					></SuccessWindow>
				</div>
			</div>
		</div>
	)
}

export default RaffleForm
