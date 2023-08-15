// NOTE: We never want to run the Host Socket if it is not supported
export class HostSocket {
    static supported: boolean = "WebSocket" in window;

    socket?: WebSocket;
    error: boolean;

    constructor() {
        this.error = false;

        if (!HostSocket.supported) {
            return;
        }

        // TODO: add in the correct path here
        this.socket = new WebSocket("ws://localhost:3000");

        // Make sure that the function works
        this.socket.onopen = function(event) {
            console.log("d");
            let data = {
                'a': 1,
            }
            this.send(JSON.stringify(data));
        }
    }
};