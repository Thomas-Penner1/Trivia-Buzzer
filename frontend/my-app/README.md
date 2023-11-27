## Trivia Buzzer Frontend

This directory contains the files needed to run the Trivia Buzzer website. Note that to host the website, you will need a server.

As well, note that you will need to have a backend server running to allow for the frontend and backend communication.

### Instructions

This project requires Node.js v16+ to run. To insall node, you can follow the instructions at https://nodejs.org/en/download.

If this is your first time running this project, then you need to first download all modules. To do this, open this directory in a command line and run:
```
npm install
```

Once you have Node.js and the node modules installed, you can run the developement environment using the command line by running:
```
npm run dev
```

The default port for the backend is 3002. To change the default port, change the port in `./package.json`:
```json
"dev": "next dev -p 3002",
```