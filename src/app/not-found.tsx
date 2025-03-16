// src/app/not-found.tsx
import React from 'react';
import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404 - Страница не найдена</h1>
      <p>Запрашиваемая страница не существует или была удалена.</p>
      <Link href="/" className={styles.homeLink}>
        Вернуться на главную
      </Link>
    </div>
  );
}