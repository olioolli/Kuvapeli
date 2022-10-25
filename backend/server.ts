// Importing module
import express from 'express';
import cors from 'cors';
import * as WebSocket from 'ws';
import * as http from 'http';
import { createGameState, WordImagePuzzle } from './types';
import { closeBrowser, getNextWord, retrievePuzzles } from './dataFetcher';
import { gameState, setGameState, updateGameState, updateRevealedState } from './gameStateHandler';

let puzzles: WordImagePuzzle[] = [];
let puzzleIdx = 0;
let puzzleFetchInProgress = false;

setInterval( () => {
    if( puzzleFetchInProgress || gameState.isRoundDone || gameState.secondLeftInRound === 0 ) return;

    gameState.secondLeftInRound--;
    if( gameState.secondLeftInRound === 0 )
        gameState.isRoundDone = true;

    updateRevealedState();
    broadCastGameState();
},1000);

process.on('exit', closeBrowser);

const setupNextPuzzle = async () => {
    if( puzzleFetchInProgress ) return;

    if (puzzleIdx >= puzzles.length - 1) {
        console.log("Puzzles done, retrieving more...");
        retrieveMorePuzzles();
    }

    if( puzzleIdx >= puzzles.length ) return;

    console.log("Setting up puzzle with index: "+puzzleIdx);
    const puzzle = puzzles[puzzleIdx];
    setGameState(createGameState(puzzle, gameState ? gameState.playerStates : []));
    puzzleIdx++;

    return puzzle;
}

const retrieveMorePuzzles = async () => {
    puzzleFetchInProgress = true;
    try {
        const result = await retrievePuzzles();
        puzzles = [...puzzles, ...result];
    }
    catch(err) {
        console.log("Error while retrieving puzzles:",err);
    }
    puzzleFetchInProgress = false;
}

retrieveMorePuzzles().then( () => {
    setupNextPuzzle();
});


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

app.post("/login", async (req, res) => {
    if (req.body.username) {
        if (!addUser(req.body.username)) {
            res.sendStatus(400);
            return;
        }
        else {
            res.sendStatus(200);
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

app.post("/game", async (req, res) => {
    const newGameState = req.body.game;
    const sendingPlayerName = req.body.player;
    updateGameState(newGameState, sendingPlayerName);

    if (isAllPlayerDone())
        await handleStartNextRound();

    broadCastGameState();
    res.status(200).json(gameState);
});

app.get("/game", (req, res) => {
    res.send(JSON.stringify(gameState));
});

app.get("/users", (req, res) => {
    res.send(JSON.stringify(users));
});

app.get("/reset", async (req, res) => {

    setGameState(createGameState(await setupNextPuzzle(), []));
    users = [];
    broadCastGameState();
    res.send("Game reset");
});

app.get("/next", async (req, res) => {
    await setupNextPuzzle()
    broadCastGameState();
    res.send("Next");
});

app.get("/puzzles", (req, res) => {
    res.send(JSON.stringify(puzzles));
});

const playerColors = [
    "Red", "Green", "Cyan", "Yellow","White"
];

const getNextPlayerColor = (playerIdx : number) => {
    if( playerIdx < playerColors.length )
        return playerColors[playerIdx];
    else
        return "white";
}

const addUser = (username: string) => {
    if (getUser(username))
        return true;

    gameState.playerStates.push({ name: username, points: 0, isDone: false, isConceded: false,  color: getNextPlayerColor(gameState.playerStates.length)});

    if (gameState.word === '') {
        gameState.word = getNextWord();
    }
    users.push(username);
    return true;
}

const handleStartNextRound = async () => {
    if (gameState.isRoundDone && !isAllPlayerDone()) return;

    await setupNextPuzzle();
    gameState.playerStates.forEach(state => {
        state.isDone = false
        state.isConceded = false;
    });
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