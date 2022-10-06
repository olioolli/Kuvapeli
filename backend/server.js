"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importing module
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var WebSocket = __importStar(require("ws"));
var http = __importStar(require("http"));
var types_1 = require("./types");
var dataFetcher_1 = require("./dataFetcher");
var puzzles = [];
var puzzleIdx = 0;
var puzzleFetchInProgress = false;
var setupNextPuzzle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var puzzle;
    return __generator(this, function (_a) {
        if (puzzleFetchInProgress)
            return [2 /*return*/];
        if (puzzleIdx >= puzzles.length - 1) {
            console.log("Puzzles done, retrieving more...");
            retrieveMorePuzzles();
        }
        if (puzzleIdx >= puzzles.length)
            return [2 /*return*/];
        console.log("Setting up puzzle with index: " + puzzleIdx);
        puzzle = puzzles[puzzleIdx];
        gameState = (0, types_1.createGameState)(puzzle, gameState ? gameState.playerStates : []);
        puzzleIdx++;
        return [2 /*return*/, puzzle];
    });
}); };
var retrieveMorePuzzles = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                puzzleFetchInProgress = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, dataFetcher_1.retrievePuzzles)()];
            case 2:
                result = _a.sent();
                puzzles = __spreadArray(__spreadArray([], puzzles, true), result, true);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log("Error while retrieving puzzles:", err_1);
                return [3 /*break*/, 4];
            case 4:
                puzzleFetchInProgress = false;
                return [2 /*return*/];
        }
    });
}); };
retrieveMorePuzzles().then(function () {
    setupNextPuzzle();
});
//readDictionary();
var app = (0, express_1.default)();
var PORT = 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
//initialize a simple http server
var server = http.createServer(app);
//initialize the WebSocket server instance
var wss = new WebSocket.Server({ server: server });
var gameState = (0, types_1.createDummyGameState)("af");
wss.on('connection', function (ws) {
    ws.isAlive = true;
    ws.on('pong', function () {
        ws.isAlive = true;
    });
    ws.on('message', function (message) {
        if (message === "gamestate") {
        }
        ws.send("Received message: ".concat(message));
    });
});
server.listen(process.env.PORT || 8999, function () {
    console.log("Listening...");
});
setInterval(function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return extWs.terminate();
        extWs.isAlive = false;
        extWs.ping(null, false);
    });
}, 10000);
var broadCastGameState = function () {
    wss.clients.forEach(function (ws) {
        var extWs = ws;
        if (!extWs.isAlive)
            return;
        extWs.send(JSON.stringify(gameState));
    });
};
// Handling GET / Request
app.get('/', function (req, res) {
    res.send('Welcome to typescript backend!');
});
// Server setup
app.listen(PORT, function () {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
});
app.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.body.username) {
            if (!addUser(req.body.username)) {
                res.sendStatus(400);
                return [2 /*return*/];
            }
            else {
                res.sendStatus(200);
                broadCastGameState();
                return [2 /*return*/];
            }
        }
        res.send(500);
        return [2 /*return*/];
    });
}); });
app.get("/isLoggedIn", function (req, res) {
    try {
        var username = req.query.username;
        var result = getUser(username) != undefined;
        res.send(JSON.stringify({ isLoggedIn: result }));
    }
    catch (err) {
        res.send(JSON.stringify({ isLoggedIn: false }));
    }
});
var updateGameState = function (newState, sendingPlayerName) {
    if (gameState.isRoundDone && !newState.isRoundDone)
        newState.isRoundDone = true;
    var newQuesses = newState.previousQuesses.filter(function (newQuess) {
        return gameState.previousQuesses.findIndex(function (quess) { return quess.player === newQuess.player && quess.text === newQuess.text; }) === -1;
    });
    gameState.previousQuesses = gameState.previousQuesses.concat(newQuesses);
    var correctNewQuess = newQuesses.filter(function (newQuess) { return newQuess.text.toLowerCase() === gameState.word.toLowerCase(); })[0];
    gameState.isRoundDone = gameState.isRoundDone || correctNewQuess ? true : false;
    var sendingPlayerState = newState.playerStates.filter(function (state) { return state.name === sendingPlayerName; })[0];
    var playerStateIdx = gameState.playerStates.findIndex(function (state) { return state.name === sendingPlayerName; });
    if (correctNewQuess && correctNewQuess.player === sendingPlayerName)
        sendingPlayerState.points += 1;
    gameState.playerStates[playerStateIdx] = sendingPlayerState;
    checkForConcession();
};
var checkForConcession = function () {
    if (gameState.isRoundDone)
        return;
    var isAllPlayersConceded = gameState.playerStates.filter(function (pState) { return pState.isConceded; }).length === gameState.playerStates.length;
    gameState.isRoundDone = isAllPlayersConceded;
};
app.post("/game", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newGameState, sendingPlayerName;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newGameState = req.body.game;
                sendingPlayerName = req.body.player;
                updateGameState(newGameState, sendingPlayerName);
                if (!isAllPlayerDone()) return [3 /*break*/, 2];
                return [4 /*yield*/, handleStartNextRound()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                broadCastGameState();
                res.status(200).json(gameState);
                return [2 /*return*/];
        }
    });
}); });
app.get("/game", function (req, res) {
    res.send(JSON.stringify(gameState));
});
app.get("/users", function (req, res) {
    res.send(JSON.stringify(users));
});
app.get("/reset", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = types_1.createGameState;
                return [4 /*yield*/, setupNextPuzzle()];
            case 1:
                gameState = _a.apply(void 0, [_b.sent(), []]);
                users = [];
                broadCastGameState();
                res.send("Game reset");
                return [2 /*return*/];
        }
    });
}); });
app.get("/next", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, setupNextPuzzle()];
            case 1:
                _a.sent();
                broadCastGameState();
                res.send("Next");
                return [2 /*return*/];
        }
    });
}); });
app.get("/puzzles", function (req, res) {
    res.send(JSON.stringify(puzzles));
});
var addUser = function (username) {
    if (getUser(username))
        return true;
    gameState.playerStates.push({ name: username, points: 0, isDone: false, isConceded: false });
    if (gameState.word === '') {
        gameState.word = (0, dataFetcher_1.getNextWord)();
    }
    users.push(username);
    return true;
};
var handleStartNextRound = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (gameState.isRoundDone && !isAllPlayerDone())
                    return [2 /*return*/];
                return [4 /*yield*/, setupNextPuzzle()];
            case 1:
                _a.sent();
                gameState.playerStates.forEach(function (state) {
                    state.isDone = false;
                    state.isConceded = false;
                });
                gameState.previousQuesses = [];
                return [2 /*return*/];
        }
    });
}); };
var isAllPlayerDone = function () {
    return gameState.playerStates.filter(function (state) { return !state.isDone; }).length === 0;
};
var getUser = function (username) {
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        if (user === username)
            return user;
    }
    return undefined;
};
var users = [];
