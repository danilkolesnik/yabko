import React, { useState, useEffect } from 'react';
import styles from './catalog.button.module.scss';
import { BurgerIcon } from '@/assets/icons/icons';

export default function CatalogButton() {
  return (
    <button className={styles.catalogButton} type="button">
      <span className={styles.invisibleButtonSpan}></span>
      <span className={styles.buttonContent}>
        <BurgerIcon />
      </span>
    </button>
  )
};