class MessageMethod {
    // General method for help syncing states when needed
    static GetState        = new MessageMethod("get-state");

    // Methods for players ===================================================
    static SetUsername     = new MessageMethod("set-username");
    static Buzz            = new MessageMethod("buzz");
    static JoinGame        = new MessageMethod("join-game");
    static PlayerClose     = new MessageMethod("player-close");
    static PlayerLeave     = new MessageMethod("player-leave");

    // Methods for hosts =====================================================
    static OpenRoom        = new MessageMethod("open-room");
    static CloseRoom       = new MessageMethod("close-room");
    static RemovePlayer    = new MessageMethod("remove-player");
    static StartGame       = new MessageMethod("start-game");
    static NextQuestion    = new MessageMethod("next-question");
    static CorrectAnswer   = new MessageMethod("correct-answer");
    static IncorrectAnswer = new MessageMethod("incorrect-answer");

    // Default message =======================================================
    static INVALID         = new MessageMethod("INVALID");

    /**
     * Create a new incoming message method
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
    }

    toString() {
        return this.name;
    }

    /**
     * Converts a string to an incoming message type. If no types
     * are available, this results in an invalid message
     * 
     * @param {string} str 
     * @returns IncomingMessageMethod
     */
    static convertString(str) {
        switch (str) {
            case MessageMethod.GetState.name:
                return MessageMethod.GetState;

            case MessageMethod.SetUsername.name:
                return MessageMethod.SetUsername;

            case MessageMethod.Buzz.name:
                return MessageMethod.Buzz;

            case MessageMethod.JoinGame.name:
                return MessageMethod.JoinGame;

            case MessageMethod.OpenRoom.name:
                return MessageMethod.OpenRoom;

            case MessageMethod.CloseRoom.name:
                return MessageMethod.CloseRoom;

            case MessageMethod.RemovePlayer.name:
                return MessageMethod.RemovePlayer;
            
            case MessageMethod.StartGame.name:
                return MessageMethod.StartGame;

            case MessageMethod.NextQuestion.name:
                return MessageMethod.NextQuestion;

            case MessageMethod.CorrectAnswer.name:
                return MessageMethod.CorrectAnswer;

            case MessageMethod.IncorrectAnswer.name:
                return MessageMethod.IncorrectAnswer;

        
            default:
                return MessageMethod.INVALID;
        }
    }
}

module.exports = MessageMethod;