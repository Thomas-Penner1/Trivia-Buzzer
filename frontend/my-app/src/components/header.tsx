import styles from './header.module.css'

export default function Header() {
    return (
        <div className={styles.centerFormHeader}>
            <div className={styles.centerFormLogoWrapper}>
                <img className={styles.centerFormLogo} src="/light-bulb.svg" alt="Light Bulb" />
            </div>
            <h1 className={styles.centerFormTitle}>Trivia Buzzer</h1>
        </div>
    )
}