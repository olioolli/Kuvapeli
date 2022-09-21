// Importing module
import express from 'express';
import { send } from 'process';
import cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';
import { createDummyGameState, createGameState, GameState, WordImagePuzzle } from './types';
import { getNextWord, retrievePuzzles } from './dataFetcher';
import { readDictionary } from './dictionaryScraper';

let puzzles: WordImagePuzzle[] = [];
let puzzleIdx = 0;

const setupNextPuzzle = () => {

    if (puzzleIdx === puzzles.length - 1) {
        puzzleIdx = 0;
        console.log("Puzzles done, retrieving more...");
        retrieveMorePuzzles();
    }

    const puzzle = puzzles[puzzleIdx];
    gameState = createGameState(puzzle, gameState ? gameState.playerStates : []);
    puzzleIdx++;

    return puzzle;
}

const retrieveMorePuzzles = () => {
    retrievePuzzles().then(result => {
        puzzles = result;
        setupNextPuzzle();
    });
}
retrieveMorePuzzles();


//readDictionary();

const app = express();
const PORT: Number = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

let gameState: GameState = createDummyGameState("af");

wss.on('connection', (ws: ExtWebSocket) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message: string) => {
        if (message === "gamestate") {

        }

        ws.send(`Received message: ${message}`);
    });
});

server.listen(process.env.PORT || 8999, () => {
    console.log("Listening...");
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return extWs.terminate();

        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);

const broadCastGameState = () => {
    wss.clients.forEach((ws) => {
        const extWs = ws as ExtWebSocket;
        if (!extWs.isAlive) return;
        extWs.send(JSON.stringify(gameState));
    });
};

// Handling GET / Request
app.get('/', (req, res) => {
    res.send('Welcome to typescript backend!');
})

// Server setup
app.listen(PORT, () => {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
})

app.post("/login", (req, res) => {
    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
            handleStartNextRound();
            broadCastGameState();
            return;
        }
    }
    res.send(500);
});

app.get("/isLoggedIn", (req, res) => {
    try {
        const username = req.query.username as string;
        const result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});

app.post("/game", (req, res) => {
    gameState = req.body.game;
    if (isAllPlayerDone())
        handleStartNextRound();

    broadCastGameState();
    res.status(200).json(gameState);
});

app.get("/game", (req, res) => {
    res.send(JSON.stringify(gameState));
});

app.get("/users", (req, res) => {
    res.send(JSON.stringify(users));
});

app.get("/reset", (req, res) => {

    gameState = createGameState(setupNextPuzzle(), []);
    users = [];
    broadCastGameState();
    res.send("Game reset");
});

app.get("/next", (req, res) => {
    setupNextPuzzle()
    broadCastGameState();
    res.send("Next");
});

app.get("/puzzles", (req, res) => {
    res.send(JSON.stringify(puzzles));
});

const addUser = (username: string) => {
    if (getUser(username))
        return true;

    gameState.playerStates.push({ name: username, points: 0, isDone: false });

    if (gameState.word === '') {
        gameState.word = getNextWord();
    }
    users.push(username);
    return true;
}

const handleStartNextRound = () => {
    if (!isAllPlayerDone()) return;

    setupNextPuzzle();
    gameState.playerStates.forEach(state => state.isDone = false);
    gameState.previousQuesses = [];
}

const isAllPlayerDone = () => {
    return gameState.playerStates.filter(state => !state.isDone).length === 0;
}

const getUser = (username: string) => {
    for (let user of users)
        if (user === username)
            return user;

    return undefined;
}

let users: string[] = [];