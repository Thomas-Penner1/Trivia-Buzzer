const MessageMethod = require("../../src/enums/messageMethod");

describe("Player Events", () => {
    let message_methods = [
        MessageMethod.GetState,
        MessageMethod.SetUsername,
        MessageMethod.Buzz,
        MessageMethod.OpenRoom,
        MessageMethod.CloseRoom,
        MessageMethod.RemovePlayer,
        MessageMethod.StartGame,
        MessageMethod.NextQuestion,
        MessageMethod.CorrectAnswer,
        MessageMethod.IncorrectAnswer,
        MessageMethod.INVALID
    ];

    it("ensure string conversions", () => {
        for (const message of message_methods) {
            let result = MessageMethod.convertString(message.toString());
            expect(result).toBe(message);
        }
    })
})