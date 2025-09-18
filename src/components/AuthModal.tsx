import React from 'react';
import ReactDOM from 'react-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="auth-modal-overlay" onClick={onClose} />
      <div className="auth-modal">
        {children}
      </div>
    </>,
    document.body
  );
};

export default AuthModal;