export enum MessageMethod {
    GetState        = "get-state",

    // Players ================================================================
    SetUsername     = "set-username",
    Buzz            = "buzz",
    JoinGame        = "join-game",
    PlayerLeave     = "player-leave",   // player left
    PlayerClose     = "player-close",   // player left by closing browser


    OpenRoom        = "open-room",
    CloseRoom       = "close-room",
    RemovePlayer    = "remove-player",
    StartGame       = "start-game",
    NextQuestion    = "next-question",
    CorrectAnswer   = "correct-answer",
    IncorrectAnswer = "incorrect-answer",
    LeaveGame       = "leave-game",
    EndGame         = "end-game",

    INVALID         = "INVALID"
}