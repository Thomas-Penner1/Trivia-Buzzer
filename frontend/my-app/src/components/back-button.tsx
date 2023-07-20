'use client'

import Link from 'next/link';
import styles from './back-button.module.css';

interface BackButtonProps {
    url: string,
}

export default function BackButton({ url }: BackButtonProps) {
    return (
        <Link href={url} className={styles.backButton}>
            <img className={styles.backButtonIcon} src="/back-arrow.svg" alt="Back Arrow" />
            <p className={styles.backButtonText}>
                Back
            </p>
        </Link>
    )
}