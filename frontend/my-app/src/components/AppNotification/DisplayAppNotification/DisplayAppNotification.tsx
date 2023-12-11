'use client'

import { useAppNotificationContext, useUpdateAppNotificationContext } from "@/context/AppNotificationContext";
import AppNotification from "../AppNotification";
import { useEffect, useState } from "react";

enum FaderStates {
    Entering,
    EnteringActive,
    Active,
    ExitActiveSlow,
    ExitActiveFast,
    Exit,
}

export function DisplayAppNotification() {
    const appNotification = useAppNotificationContext();
    const updateAppNotification = useUpdateAppNotificationContext();

    const [state, setState] = useState(FaderStates.Entering);

    // Handle state manipulations =============================================
    const transitionInLength = 500;
    const notificationLength = 10000;
    const transitionOutSlowLength = 3000;
    const transitionOutFastLength = 100;

    let timeoutId: undefined | NodeJS.Timeout = undefined;

    let startTime = Date.now();

    useEffect(() => {
        if (appNotification === null) {
            return;
        }

        startTime = Date.now();

        if (state === FaderStates.Entering) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.EnteringActive)
            }, 0);

        } else if (state === FaderStates.EnteringActive) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.Active)
            }, transitionInLength)

        } else if (state === FaderStates.Active) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.ExitActiveSlow);
            }, notificationLength);

        } else if (state === FaderStates.ExitActiveSlow) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.Exit);
            }, transitionOutSlowLength);

        } else if (state === FaderStates.ExitActiveFast) {
            timeoutId = setTimeout(() => {
                setState(FaderStates.Exit);
            }, transitionOutFastLength);

        } else if (state === FaderStates.Exit) {
            updateAppNotification.removeAppNotification();
        }
    });

    if (appNotification === null) {
        return null;
    }

    // Handle Styles ==========================================================
    let faderStateStyle: any = {};

    // Gets the class to display
    if (state === FaderStates.Entering) {
        faderStateStyle = {
            opacity: 0,
        };

    } else if (state === FaderStates.EnteringActive) {
        faderStateStyle = {
            opacity: 1,
            transitionProperty: "opacity",
            transitionDuration: `${transitionInLength}ms`,
            transitionTimingFunction: "ease-in-out",
        }

    } else if (state === FaderStates.Active) {
        faderStateStyle = {
            opacity: 1,
        };

        
    } else if (state === FaderStates.ExitActiveSlow) {
        faderStateStyle = {
            opacity: 0,
            transitionProperty: "opacity",
            transitionDuration: `${transitionOutSlowLength}ms`,
            transitionTimingFunction: "ease-in-out",
        };

        
    } else if (state === FaderStates.ExitActiveFast) {
        faderStateStyle = {
            opacity: 0,
            transitionProperty: "opacity",
            transitionDuration: `${transitionOutFastLength}ms`,
            transitionTimingFunction: "ease-in-out",
        };
    } else {
        faderStateStyle = {
            opacity: 0,
        };

    }

    // Handle removing the notification
    function removeNotification() {
        clearTimeout(timeoutId);
        setState(FaderStates.ExitActiveFast);
    }

    return (
        <div style={faderStateStyle}>
            <AppNotification notification={appNotification} removeNotification={removeNotification}/>
        </div>
    );
}