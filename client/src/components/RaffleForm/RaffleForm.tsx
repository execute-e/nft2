import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import styles from './index.module.scss'
import ModalWindow from '../ModalWindow/ModalWindow'
import { lazy, Suspense } from 'react'
import SuccessWindow from '../FinalResModal/SuccessPassModal'

const WinnersTable = lazy(() => import('../WinnersTable/WinnersTable'))

type FormInputs = {
	walletAddress: string
}

interface RaffleFormProps {
	imageUrl?: string
	onSubmitSuccess?: (data: any) => void
}

export const RaffleForm = ({ imageUrl, onSubmitSuccess }: RaffleFormProps) => {
	const [submissionError, setSubmissionError] = useState<string | null>(null)
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false)

	const savedData = sessionStorage.getItem('raffleFormData')
	const initialValues = savedData
		? JSON.parse(savedData)
		: { walletAddress: '' }

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

	const onSubmit: SubmitHandler<FormInputs> = async data => {
		setSubmissionError(null)

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/waitlist/register`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						wallet_address: data.walletAddress,
					}),
				}
			)

			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.error || 'An unknown error occurred')
			}

			const result = await response.json()

			if (onSubmitSuccess) {
				onSubmitSuccess(result)
			}

			setIsSuccessModalOpen(true)

			sessionStorage.removeItem('raffleFormData')
			reset()
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
						<h2 className={styles.formTitle}>Join the waitlist!</h2>
						<p className={styles.formSubtitle}>
							To participate in the whitelist follow these steps.
						</p>

						<div className={styles.inputGroup}>
							<label htmlFor='wallet'>Provide your Wallet Address</label>
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
							{isSubmitting ? 'Submitting...' : 'Enter Waitlist'}
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
						<Suspense fallback={<div>Loading...</div>}>
							<WinnersTable />
						</Suspense>
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
