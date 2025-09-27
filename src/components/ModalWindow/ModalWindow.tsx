import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.scss'

type ModalProps = {
	children: React.ReactNode
	isOpen: boolean
	onClose: () => void
}

const ModalWindow = ({ children, isOpen, onClose }: ModalProps) => {
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen, onClose])

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<button className={styles.modalClose} onClick={onClose}>
					x
				</button>
				{children}
			</div>
		</div>,
		document.getElementById('portal-root') as HTMLElement
	)
}

export default ModalWindow
