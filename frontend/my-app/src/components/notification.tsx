import { CSSTransition } from 'react-transition-group';
import { useEffect, useRef, useState } from 'react';

import styles from "./notification.module.css"

interface AppNotificationProps {
    message: string,
    removeFunction: Function,
    inProp: boolean,
    activeTime: number,
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

export default function AppNotification({message, removeFunction, inProp, activeTime}: AppNotificationProps) {
    const [state, setState] = useState(FaderStates.Entering);

    let faderStateClass: string;

    // Gets the class to display
    if (state === FaderStates.Entering) {
        faderStateClass = styles['fader-enter'];

    } else if (state === FaderStates.EnteringActive) {
        faderStateClass = styles['fader-enter-active'];

    } else if (state === FaderStates.Active) {
        faderStateClass = styles['fader-active'];
        
    } else if (state === FaderStates.ExitActive) {
        faderStateClass = styles['fader-exit-active'];
        
    } else {
        faderStateClass = styles['fader-exit'];
    }

    // Logic for manipulating the states
    useEffect(() => {
        if (state === FaderStates.Entering) {
            setState(FaderStates.EnteringActive);

        } else if (state === FaderStates.EnteringActive) {
            setTimeout(() => {
                setState(FaderStates.Active);
            }, 500);

        } else if (state === FaderStates.Active) {
            if (activeTime >= 0) {
                setTimeout(() => {
                    setState(FaderStates.ExitActive);
                }, activeTime);
            }

        } else if (state === FaderStates.ExitActive) {
            setTimeout(() => {
                setState(FaderStates.Exit);
            }, 500);

        } else {
            removeFunction();
        }
    });

    return (
        <div className={styles.notificationPosition}>
            <div className={faderStateClass}>
                <div className={styles.notificationBoxWrapper}>
                    <div className={styles.notificationBox}>
                        <div className={styles.notificationImageWrapper}>
                            <img className={styles.notificationImage} src="/x-symbol.svg" alt="" />
                        </div>

                        <div className={styles.notificationContentWrapper}>
                            <div className={styles.notificationTitle}>
                                Error
                            </div>
                            <div className={styles.notificationContent}>
                                {message}
                            </div>
                        </div>

                        <div className={styles.notificationClose}>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}