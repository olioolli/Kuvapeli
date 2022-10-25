import { createDummyGameState, GameState, timeBasedLetterReveal } from "./types";

export let gameState: GameState = createDummyGameState("af");

export const setGameState = (newGameState : GameState) => {
    gameState = newGameState;
}

const getRevealedBestQuess = () => {

    let bestQuess = revealLettersBasedOnTime().revealedString;

    if (!gameState.previousQuesses) return bestQuess;

    gameState.previousQuesses.forEach(quess => {
        const revealStr = getRevealedQuess(quess.text);
        if (revealStr.length > bestQuess.length)
            if (bestQuess.length < revealStr.length)
                bestQuess = revealStr;
    })

    return bestQuess;
};

const revealLettersBasedOnTime = (): timeBasedLetterReveal => {
    const percentageOfTime = (120 - gameState.secondLeftInRound) / 120; // TODO: fix hardcoded max round time
    const lettersToBeRevealed = Math.round(gameState.word.length * percentageOfTime);
    const revealedString = revealLetters((word, i) => i <= lettersToBeRevealed);
    return {
        revealedString,
        revealedLetterCount: revealLetters.length
    }
};

const revealLetters = (doRevealLetter: (word: string, i: number) => boolean) => {
    return Array.from(gameState.word).reduce((revealed, letter, idx) => {
        if (doRevealLetter(gameState.word, idx))
            revealed += letter;
        return revealed;
    }, '');
};

const getRevealedQuess = (quess: string) => {

    let revealedLetterCount = 0;
    let retStr = revealLetters((word, i) => {
        if (quess.length <= i || gameState.word.length <= i) return false;

        const doReveal = gameState.word[i].toLowerCase() === quess[i].toLowerCase()
        if (doReveal) revealedLetterCount++;
        return doReveal;
    });

    if (retStr.length === gameState.word.length)
        return retStr;
    else
        return retStr + "..";
}

export const updateRevealedState = () => {
    const newBestQuess = getRevealedBestQuess();
    if( gameState.revealedWord.length >= newBestQuess.length ) return;
    gameState.revealedWord = newBestQuess;
}


export const updateGameState = (newState : GameState, sendingPlayerName : string) => {
    if( gameState.isRoundDone && !newState.isRoundDone )
        newState.isRoundDone = true;

    const newQuesses = newState.previousQuesses.filter( (newQuess) => {
        return gameState.previousQuesses.findIndex( quess => quess.player === newQuess.player && quess.text === newQuess.text ) === -1;
    });
    gameState.previousQuesses = gameState.previousQuesses.concat(newQuesses);

    const correctNewQuess = newQuesses.filter( newQuess => newQuess.text.toLowerCase() === gameState.word.toLowerCase() )[0];
    gameState.isRoundDone = gameState.isRoundDone || correctNewQuess ? true : false;

    const sendingPlayerState = newState.playerStates.filter( state => state.name === sendingPlayerName)[0];
    const playerStateIdx = gameState.playerStates.findIndex( state => state.name === sendingPlayerName);
    if( correctNewQuess && correctNewQuess.player === sendingPlayerName )
        sendingPlayerState.points += 1;

    updateRevealedState();

    gameState.playerStates[playerStateIdx] = sendingPlayerState;
    checkForConcession();
};

const checkForConcession = () => {
    if( gameState.isRoundDone ) return;

    const isAllPlayersConceded = gameState.playerStates.filter( pState => pState.isConceded ).length === gameState.playerStates.length;
    gameState.isRoundDone = isAllPlayersConceded;
}