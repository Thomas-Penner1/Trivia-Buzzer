import { useEffect, useState } from "react"
import styles from "./Notification.module.css"


/**
 * messsage: the message to be displayed
 * 
 * notificationDelay: How long until we transition in the element?
 *      if ommitted or negative, considered to be zero
 * 
 * transitionDuration: duration of transition in and transition out
 *      stages. If ommitted, or negative, considered to be zero
 * 
 * notificationDuraction: how long the notification will be displayed
 *      before vanishing. If ommitted or non-positive, considered to
 *      be infinite
 * 
 * style: which style to be displayed
 * 
 * callback: callback function to be run once the entire script has
 *      completed. can be use for cleanup of the object
 */
interface AppNotificationProps {
    message: string,

    notificationDelay?: number,
    transitionDuration?: number,
    notificationDuration?: number,
    
    style?: string,

    callback?: Function,
}


/*
 * Progression:
 *  1. Entering
 *      - The initial construction of this component
 *  2. EnteringActive
 *      - The animation transition from entering to active
 *  3. Active
 *      - How we want it to appear
 *  4. ExitActive
 *      - The animation from active to exit
 *  5. Exit
 *      - The appearance when it is no longer there
 */
enum FaderStates {
    Entering,
    EnteringActive,
    Active,
    ExitActive,
    Exit,
}


/*
 * Style can be:
 *  - default
 *  - error
 * If ommited, it takes on the default style
 */
export function AppNotification({
        message, 
        style="default", 
        notificationDelay, 
        transitionDuration, 
        notificationDuration,
        callback,
    }: AppNotificationProps) {

    // Process arguments and their default values =============================
    let delay = 0;
    let transitionLength = 0;
    let notificationLength = 0;

    if (notificationDelay !== undefined && notificationDelay > 0) {
        delay = notificationDelay;
    }

    if (transitionDuration !== undefined && transitionDuration > 0) {
        transitionLength = transitionDuration;
    }

    if (notificationDuration !== undefined && notificationDuration > 0) {
        notificationLength = notificationDuration;
    }

    let initialState;

    if (delay === 0) {
        if (transitionLength === 0) {
            initialState = FaderStates.Active;
        } else {
            initialState = FaderStates.Entering;
        }
    } else {
        initialState = FaderStates.Entering;
    }

    const [state, setState] = useState(initialState);

    // Get theme dependent styles =============================================
    let notificationStyle: string = styles['default-notification'];

    let img_path = "/notification.svg";
    let title = "Notification";

    if (style === "error") {
        title = "Error";
        img_path = "/x-symbol.svg";
        notificationStyle = styles['error-notification'];
    }

    // Handle Animations ======================================================
    let faderStateStyle: any = {};
    let faderStateClass: string;

    // Gets the class to display
    if (state === FaderStates.Entering) {
        faderStateClass = styles['fader-enter'];
        faderStateStyle = {
            opacity: 0,
        };

    } else if (state === FaderStates.EnteringActive) {
        faderStateClass = styles['fader-enter-active'];
        faderStateStyle = {
            opacity: 1,
            transitionProperty: "opacity",
            transitionDuration: `${transitionLength}ms`,
            transitionTimingFunction: "ease-in-out",
        }

    } else if (state === FaderStates.Active) {
        faderStateClass = styles['fader-active'];
        faderStateStyle = {
            opacity: 1,
        };

        
    } else if (state === FaderStates.ExitActive) {
        faderStateClass = styles['fader-exit-active'];
        faderStateStyle = {
            opacity: 0,
            transitionProperty: "opacity",
            transitionDuration: `${transitionLength}ms`,
            transitionTimingFunction: "ease-in-out",
        };

        
    } else {
        faderStateClass = styles['fader-exit'];
        faderStateStyle = {
            opacity: 0,
        };

    }

    // Handle state manipulations =============================================

    let timeoutId: undefined | NodeJS.Timeout = undefined;

    useEffect(() => {
        if (state === FaderStates.Entering) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.EnteringActive)
            }, delay)

        } else if (state === FaderStates.EnteringActive) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.Active)
            }, transitionLength)

        } else if (state === FaderStates.Active) {
            if (notificationLength > 0) {
                timeoutId = setTimeout(() => {
                    setState(FaderStates.ExitActive);
                }, notificationLength);
            }

        } else if (state === FaderStates.ExitActive) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.Exit);
            }, transitionLength);

        } else {
            if (callback !== undefined) {
                callback();
            }
        }
    })

    function removeNotification() {
        clearTimeout(timeoutId);
        setState(FaderStates.ExitActive);
    }
    
    return (
        <div className={styles.notificationPosition}>
            <div style={faderStateStyle}>

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
                                    {message}
                                </div>
                            </div>

                            <div className={styles.notificationClose} onClick={removeNotification}>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/*
 * A wrapper for creating error messages. Ignores the style argument
 */
export function AppError({
    message, 
    notificationDelay, 
    transitionDuration, 
    notificationDuration,
    callback,
}: AppNotificationProps) {
    return <AppNotification 
        message={message} 
        style="error" 
        transitionDuration={transitionDuration}
        notificationDelay={notificationDelay}
        notificationDuration={notificationDuration}
        callback={callback}
    />
}