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

router.post('/join-room', jsonParser, (req, res) => {
    buzzer.joinRoom(req, res);
})

module.exports = router;