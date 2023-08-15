class MessageMethod {
    // A method to check equality of our enums (idk if this should be added)
    // to a base class or not tbh
    static isEqual(val1, val2) {
        return val1.name === val2.name;
    }

    static JoinHost = new MessageMethod("join-host");
    static JoinPlayer = new MessageMethod("join-player");
    static SetUsername = new MessageMethod("set-username");
    static OpenRoom = new MessageMethod("open-room");
    static CloseRoom = new MessageMethod("close-room");
    static RemovePlayer = new MessageMethod("remove-player");
    static StartGame = new MessageMethod("start-game");

    // Last one that we will implement - this will be the trickiest one tbh
    static Buzz = new MessageMethod("buzz");
    static AssignPoints = new MessageMethod("assign-points");
    static NextQuestion = new MessageMethod("next-question");

    constructor (name) {
        this.name = name;
    }
}

module.exports = MessageMethod;