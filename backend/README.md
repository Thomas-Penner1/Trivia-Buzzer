## Trivia Buzzer Backend

This directory contains the files needed to run the Trivia Buzzer server. Note that to host the website, you will need a server.

### Instructions

This project requires Node.js v16+ to run. To install node, you can follow the instructions at https://nodejs.org/en/download.

If this is your first time running, then you need to first download all modules. To do this, open this directory in a command line and run:
```
npm install
```

Once you have Node.js and the node modules installed, you can run the developement environment using the command line by running:
```
npm run dev
```

The default port for the backend is 3000. To change the default port, change the port in `./src/index.js`:
```javascript
const port = 3000;
```