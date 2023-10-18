/*
 * Status usage / definition
 *      pending:   Player has "joined" room, but not finalized status
 * 
 *      ready:     Player has set-up their username, but the game has not yet
 *                 started yet / they have not joined the current question
 * 
 *      active:    The game has started, the user has a username, and the
 *                 user has joined the game
 * 
 *      buzz:      The user has successfully buzzed in
 * 
 *      incorrect: The user answered a question incorrectly, and we have not
 *                 transitioned to the next question yet
 */
export enum PlayerStatus {
    Pending = "Pending",
    Ready = "Ready",
    Active = "Active",
    Buzz = "Buzz",
    Incorrect = "Incorrect",
    Correct = "Correct",
}