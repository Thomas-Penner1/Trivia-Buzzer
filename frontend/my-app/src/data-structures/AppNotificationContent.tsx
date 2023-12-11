export enum AppNotificationStyle {
    Notification,
    Error,
}

export interface AppNotificationContent {
    message: string;
    style: AppNotificationStyle;
}