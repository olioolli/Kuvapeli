import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BE_URL, BE_WS_URL } from "../state";
import { GameState, copyGameState, createDummyGameState, PreviousQuess } from "../types/types";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { getCurrentPlayerName } from "./utils";

export const useGameState = () => {

    const [gameState, setGameState ] = useState<GameState>(createDummyGameState("talo"));

    const updateGameState = (newPreviousQuesses?: PreviousQuess[]) => {

        const newState = copyGameState({
            ...gameState,
            previousQuesses : newPreviousQuesses ? newPreviousQuesses : gameState.previousQuesses,
            playerStates: gameState.playerStates
        });

        sendGameStateToBE(newState);
    }

    const setPlayerDone = () => {
        const newState = copyGameState(gameState);
        newState.playerStates.filter( state => state.name === getCurrentPlayerName() )[0].isDone = true;
        sendGameStateToBE(newState);
    }

    const setPlayerConceded = () => {
        const newState = copyGameState(gameState);
        newState.playerStates.filter( state => state.name === getCurrentPlayerName() )[0].isConceded = true;
        sendGameStateToBE(newState);
    }

    const sendGameStateToBE = async (state: GameState) => {
        const resp = await axios.post(BE_URL + "/game", { game: state, player: getCurrentPlayerName() });
        setGameState(resp.data);
    };

    const fetchGameStateFromBe = useCallback(() => {
        axios.get(BE_URL + "/game").then((resp) => {
            setGameState(resp.data);
        })
    }, []);

    useEffect(() => {

        let client = new W3CWebSocket(BE_WS_URL);

        client.onopen = () => {};

        client.onmessage = (message) => {

            const newGameState = JSON.parse(message.data as string);
            if (newGameState)
                setGameState(newGameState);
        };

        fetchGameStateFromBe();
    }, [fetchGameStateFromBe]);

    return {
        gameState: gameState,
        updateGameState,
        setPlayerDone,
        setPlayerConceded
    };
}