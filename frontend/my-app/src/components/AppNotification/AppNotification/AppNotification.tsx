import styles from "./AppNotification.module.css"
import { AppNotificationContent, AppNotificationStyle } from "@/data-structures/AppNotificationContent";


interface AppNotificationProps {
    notification: AppNotificationContent;
    removeNotification: () => any;
}


export function AppNotification({ notification, removeNotification }: AppNotificationProps) {
    let notificationStyle: string = styles['default-notification'];

    let img_path = "/notification.svg";
    let title = "Notification";

    if (notification.style === AppNotificationStyle.Error) {
        title = "Error";
        img_path = "/x-symbol.svg";
        notificationStyle = styles['error-notification'];
    }

    return (
        <div className={styles.notificationPosition}>
            <div className={notificationStyle}>
                <div className={styles.notificationBoxWrapper}>

                    <div className={styles.notificationBox}>
                        <div className={styles.notificationImageWrapper}>
                            <img className={`${styles.notificationImage} ${styles.filterGreen}`} src={img_path} alt="" />
                        </div>

                        <div className={styles.notificationContentWrapper}>
                            <div className={styles.notificationTitle}>
                                {title}
                            </div>
                            <div className={styles.notificationContent}>
                                {notification.message}
                            </div>
                        </div>

                        <div className={styles.notificationClose} onClick={removeNotification}>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
