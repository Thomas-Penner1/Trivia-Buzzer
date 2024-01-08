// Returns a function that increments an initial counter,
// or starts from zero
function create_id(n?: number) {
    if (n === undefined) {
        n = 0;
    }

    let m = n;

    return function() {
        let output = m;
        m = m + 1;

        return output;
    }
}

const getNextId = create_id();

export enum AppNotificationStyle {
    Notification,
    Error,
}

export class AppNotificationContent {
    message: string;
    style: AppNotificationStyle;

    constructor(message: string, style: AppNotificationStyle) {
        // this.id = getNextId();
        this.message = message;
        this.style = style;
    }
}