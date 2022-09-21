export type PlayerState = {
    name: string;
    points: number;
    isDone: false;
}

export type PreviousQuess = {
    text: string;
    player: string;
}

export type GameState = {
    isRoundDone: boolean;
    word: string;
    previousQuesses: PreviousQuess[];
    imagesUrls: string[];
    playerStates: PlayerState[];
}

export type WordImagePuzzle = {
    word: string;
    imageUrls : string[]
};

export const createGameState = (puzzle : WordImagePuzzle, playerStates : PlayerState[]) : GameState => {
    
    return {
        word: puzzle.word,
        playerStates : playerStates,
        isRoundDone: false,
        imagesUrls : puzzle.imageUrls,
        previousQuesses: [],
    };
}

export const createDummyGameState = (word: string): GameState => {

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
    }
}