'use client'

import React, { ReactNode, useContext, useState } from "react";

import { AppNotificationStyle, AppNotificationContent } from "@/data-structures/AppNotificationContent";


interface DisplayNewAppNotification {
    displayAppNotification: (message: string) => void,
    displayError: (message: string) => void,
    removeAppNotification: () => void,
};


const defaultUpdateNotifications = {
    displayAppNotification: (message: string) => {},
    displayError: (message: string) => {},
    removeAppNotification: () => {},
} as DisplayNewAppNotification;



const AppNotificationContext = React.createContext<AppNotificationContent | null>(null);
const UpdateAppNotificationContext = React.createContext<DisplayNewAppNotification>(defaultUpdateNotifications);

export function useAppNotificationContext() {
    return useContext(AppNotificationContext);
}

export function useUpdateAppNotificationContext() {
    return useContext(UpdateAppNotificationContext);
}


interface NotificationProviderProps {
    children: ReactNode;
}


export function AppNotificationProvider({children}: NotificationProviderProps) {
    const [CurrentNotification, setCurrentNotification] = useState<AppNotificationContent | null>(null);

    function displayNotification(message: string) {
        setCurrentNotification({message: message, style: AppNotificationStyle.Notification});
    }

    function displayError(message: string) {
        setCurrentNotification({message: message, style: AppNotificationStyle.Error});
    }

    function removeAppNotification() {
        setCurrentNotification(null);
    }

    return (
        <AppNotificationContext.Provider value={CurrentNotification}>
            <UpdateAppNotificationContext.Provider value={{
                displayAppNotification: displayNotification,
                displayError: displayError,
                removeAppNotification: removeAppNotification,
            }}>
                {children}
            </UpdateAppNotificationContext.Provider>
        </AppNotificationContext.Provider>
    )
}