import React from 'react';
import styles from './regular.button.module.scss';

interface RegularButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const RegularButton: React.FC<RegularButtonProps> = ({
  onClick,
  title,
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.regularButton}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {title}
    </button>
  );
};

export default RegularButton;
