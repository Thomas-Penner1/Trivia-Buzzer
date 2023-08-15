const express = require('express');
const ws = require('ws');
const cors = require('cors');

const app = express();
const port = 3000;

const buzzerWS = require('./buzzer/buzzer-ws');

app.use(cors());

const buzzerRoutes = require('./buzzer/buzzer-routes');

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use('/buzzer', buzzerRoutes);

const httpServer = app.listen(port, () => {
    console.log(`example app listening on port ${port}`)
})

const wsServer = new ws.Server({ noServer: true })

httpServer.on('upgrade', (req, socket, head) => {
    
    wsServer.handleUpgrade(req, socket, head, buzzerWS.handleConnection)
})