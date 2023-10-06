export enum MessageMethod {
    GetState        = "get-state",
    SetUsername     = "set-username",
    Buzz            = "buzz",
    JoinGame        = "join-game",
    PlayerLeave     = "player-leave",
    OpenRoom        = "open-room",
    CloseRoom       = "close-room",
    RemovePlayer    = "remove-player",
    StartGame       = "start-game",
    NextQuestion    = "next-question",
    CorrectAnswer   = "correct-answer",
    IncorrectAnswer = "incorrect-answer",
    INVALID         = "INVALID"
}