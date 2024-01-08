'use client'

import { useAppNotificationContext, useUpdateAppNotificationContext } from "@/context/AppNotificationContext";
import AppNotification from "../AppNotification";
import { useEffect, useState } from "react";
import { AppNotificationContent } from "@/data-structures/AppNotificationContent";

enum FaderStates {
    Entering,
    EnteringActive,
    Active,
    ExitActive,
    Exit,
}

interface AppNotificationWrapperProps {
    notification: AppNotificationContent;
    removeNotification: () => any;
}

// NOTE: we needed a wrapper to ensure that the behaviour of the code is correct
// this way, changing the notification will reset the animation of loading and unloading
// the value
function AppNotificationWrapper({notification, removeNotification} : AppNotificationWrapperProps) {
    const [state, setState] = useState(FaderStates.Entering);

    // Handle the transitions between states ==================================
    const transitionInLength = 500;
    const notificationLength = 10000;
    const transitionOutLength = 3000;

    useEffect(() => {
        if (state === FaderStates.Entering) {
            setTimeout(() => {
                setState(FaderStates.EnteringActive);
            }, 1);

        } else if (state === FaderStates.EnteringActive) {
            setTimeout(() => {
                setState(FaderStates.Active)
            }, transitionInLength)

        } else if (state === FaderStates.Active) {
            setTimeout(() => {
                setState(FaderStates.ExitActive);
            }, notificationLength);

        } else if (state === FaderStates.ExitActive) {
            setTimeout(() => {
                setState(FaderStates.Exit);
            }, transitionOutLength);

        } else if (state === FaderStates.Exit) {
            removeNotification();
        }
    });

    // Use States to get styles ===============================================
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

        
    } else if (state === FaderStates.ExitActive) {
        faderStateStyle = {
            opacity: 0,
            transitionProperty: "opacity",
            transitionDuration: `${transitionOutLength}ms`,
            transitionTimingFunction: "ease-in-out",
        };

    } else {
        faderStateStyle = {
            opacity: 0,
        };
    }

    return (
        <div style={faderStateStyle}>
            <AppNotification notification={notification} removeNotification={removeNotification}/>
        </div>
    )
}


export function DisplayAppNotification() {
    const appNotification = useAppNotificationContext();
    const updateAppNotification = useUpdateAppNotificationContext();

    function removeNotification() {
        updateAppNotification.removeAppNotification();
    }

    return (
        appNotification == null ? 
            null : 
            <AppNotificationWrapper notification={appNotification} removeNotification={removeNotification}/>
    )
}