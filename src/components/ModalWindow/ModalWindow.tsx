import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const ModalWindow = ({ children, isOpen, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
      document.documentElement.classList.add('locked');
    } else {
      modal.close();
      document.documentElement.classList.remove('locked');
    }
  }, [isOpen]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => onClose();
    modal.addEventListener('close', handleClose);

    return () => modal.removeEventListener('close', handleClose);
  }, [onClose]);

  return ReactDOM.createPortal(
    <dialog
      className={styles.modal}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          onClose();
        }
      }}
      ref={modalRef}>
      <div className={styles.inner}>
        <button className={styles.modalClose} onClick={onClose}>
          x
        </button>
        {children}
      </div>
    </dialog>,
    document.getElementById('portal-root') as HTMLElement,
  );
};

export default ModalWindow;
