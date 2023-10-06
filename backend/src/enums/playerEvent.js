class PlayerEvent {
    static SetUsername = new PlayerEvent("set-username");
    static Buzz        = new PlayerEvent("buzz");

    static INVALID     = new PlayerEvent("INVALID");

    /**
     * Creates a new player event
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * Converts a player event to a string, for easily creating
     * events with this class
     * 
     * @returns string
     */
    toString() {
        return this.name;
    }

    /**
     * Converts a string to a player event. If no player events
     * match, this results in an invalid event
     * 
     * @param {string} str - the string to be converted
     */
    static convertString(str) {
        switch (str) {
            case "set-username":
                return PlayerEvent.SetUsername;

            case "buzz":
                return PlayerEvent.Buzz;
        
            default:
                return PlayerEvent.INVALID;
        }
    }
}

module.exports = PlayerEvent;