import styles from './loader.module.css'

const DEFAULT_MESSAGE = "Loading. Please wait...";

interface LoaderProps {
    message?: string
}

export default function Loader({message}: LoaderProps) {
    let displayMessage: string;

    if (message) {
        displayMessage = message;
    } else {
        displayMessage = DEFAULT_MESSAGE;
    }

    return (
        <div className={styles.loaderBoxWrapper}>
            <div className={styles.loaderBox}>
                <div className={styles.loaderWrapper}>
                    <div className={styles.loader}>
                    </div>
                </div>
                
                <div className={styles.loadingMessage}>
                    {displayMessage}
                </div>
            </div>
        </div>
    )
}