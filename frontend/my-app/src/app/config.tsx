interface Config {
    serverBaseUrl: string,
    clientBaseUrl: string,
    webSocketUrl : string,
}

let json: object;

// Read the config file based on which environement we are in so that we can get
// the correct values :)
const env = process.env.NODE_ENV;

if (env == "development") {
    json = require("../config/config-dev.json");

} else if (env =="production") {
    json = {
        serverUrl: "",
        clientUrl: "",
        webSocketUrl: "",
    }

} else {
    json = {
        serverUrl: "",
        clientUrl: "",
        webSocketUrl: "",
    }
}

export const appConfig = json as Config;