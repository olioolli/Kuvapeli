"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDummyGameState = exports.createGameState = void 0;
var createGameState = function (puzzle, playerStates) {
    return {
        word: puzzle.word,
        playerStates: playerStates,
        isRoundDone: false,
        imagesUrls: puzzle.imageUrls,
        previousQuesses: [],
    };
};
exports.createGameState = createGameState;
var createDummyGameState = function (word) {
    return {
        isRoundDone: false,
        word: "Talo",
        previousQuesses: [],
        imagesUrls: [
            "https://designtalo.fi/wp-content/uploads/2020/06/designtalo-nordic-idyll-220-ahtari-2-of-27.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/c/c3/Tagel%C3%B6hnerhaus_qtl1.jpg",
            "https://static.visitestonia.com/images/3806446/1600_900_false_false_d9165ba89e3eb47b9e66a12e697c9678.jpg",
            "https://is.mediadelivery.fi/img/468/01defcd430dc896cbc64541bdd195e6b.jpg"
        ],
        playerStates: []
    };
};
exports.createDummyGameState = createDummyGameState;
