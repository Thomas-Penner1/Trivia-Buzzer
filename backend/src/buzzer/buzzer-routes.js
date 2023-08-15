const express = require('express');
const buzzer = require("./buzzer");
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();

/*
 * Needed routes:
 *      - create-game
 *          creates a new game, and provides the necessary information to the
 *          front-end to join
 * 
 *      - join-game
 *          determines if a game exists for the corresponding passcode. If the
 *          game exists, then we provide the necessary joining information
 *          back to the client
 */

router.post('/create-game', (req, res) => {
    buzzer.createGame(req, res);
})

// router.post('/:roomCode/game-code', (req, res) => {
//     buzzer.generateRoomCode(req, res);
// })

router.post('/:roomCode/:playerId/set-username', jsonParser, (req, res) => {
    buzzer.setUsername(req, res);
})

router.post('/:roomCode/close-room', (req, res) => {
    buzzer.closeRoom(req, res);
})

router.post('/:roomCode/open-room', (req, res) => {
    buzzer.openRoom(req, res);
})

router.post('/join-room', jsonParser, (req, res) => {
    console.log("here");
    buzzer.joinRoom(req, res);
})

router.post('/:roomCode/remove-player', jsonParser, (req, res) => {
    buzzer.removePlayer(req, res);
})

router.post('/:roomCode/:playerId/question-result', jsonParser, (req, res) => {
    buzzer.questionResult(req, res);
})

module.exports = router;