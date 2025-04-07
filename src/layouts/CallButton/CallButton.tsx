'use client';
import styles from './call.button.module.scss';
import { useCall } from "@/context/CallContext";
import { useOverlay } from '@/context/OverlayContext';
import { useState, useEffect } from "react";
import { CallButtonIcon, TelegramIcon } from '@/assets/icons/icons';

const CallButton = () => {
    const { openCall } = useCall();
    const { showOverlay } = useOverlay();
    const [showIcon, setShowIcon] = useState(true);
    const [isShaking, setIsShaking] = useState(false);
    const [fade, setFade] = useState(true);
    useEffect(() => {
      const toggleDisplay = setInterval(() => {
        setFade(false); 
        setTimeout(() => {
          setShowIcon((prev) => !prev);
          setFade(true);
        }, 500);
      }, 10000);
  
      return () => clearInterval(toggleDisplay);
    }, []);
    
    useEffect(() => {
      if (!showIcon) return; 
      const shakeInterval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); 
      }, 3000);
  
      return () => clearInterval(shakeInterval);
    }, [showIcon]);

    const handleCallButtonClick = () => {
        openCall();
        showOverlay();
    };

    return (
        <div className={styles.callButtonWrapper}>
            <div className={styles.callButton} onClick={handleCallButtonClick}>
                <div
                    className={`${styles.callButtonContent} ${isShaking ? styles.shake : ""} ${
                        fade ? styles.fadeIn : styles.fadeOut
                    }`}
                >
                    {showIcon ? <CallButtonIcon /> : <span className={styles.callButtonText}>Кнопка<br/>зв'язку</span>}
                </div>
            </div>
            <div className={styles.telegramButton}>
                <TelegramIcon />
            </div>
        </div>
    );
}

export default CallButton;