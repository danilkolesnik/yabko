import React from "react";
import styles from "./input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input: React.FC<InputProps> = ({ error, className, ...props }) => {
  return (
    <div className={styles.inputContainer}>
      <input
        className={`${styles.input} ${error ? styles.error : ""} ${className || ""}`}
        {...props}
      />
    </div>
  );
};

export default Input;
