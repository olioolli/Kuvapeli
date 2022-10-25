import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlayerNameToColor } from '../types/types';
import { useGameState } from '../util/GameStateProvider';
import { getCurrentPlayerName } from '../util/utils';
import { ChatComponent } from './ChatComponent';
import { ImageComponent } from './ImageComponent';
import { ImageWindow } from './ImageWindow';
import { LetterSelectComponent } from './LetterSelectComponent';
import { PlayerInfo } from './PlayerInfoComponent';
import { TimerComponent } from './TimerComponent';
import { WordComponent } from './WordComponent';

export const MainView = () => {

    const { gameState, updateGameState, setPlayerDone, setPlayerConceded } = useGameState();
    const [zoomedImgUrl, setZoomedImgUrl] = useState<string | undefined>();

    const handleNewQuess = (quess: string) => {
        gameState.previousQuesses.push({
            text: quess,
            player: getCurrentPlayerName()
        });
        updateGameState(gameState.previousQuesses);
    }

    const handleImageDoubleClick = (imageSrc: string) => {
        setZoomedImgUrl(imageSrc);
    }

    const handleImageSingleClick = () => {
        setZoomedImgUrl(undefined);
    }

    const isConcededButtonDisabled = () => {
        const playerName = getCurrentPlayerName();
        return gameState.playerStates.filter(pState => pState.name === playerName)[0]?.isConceded;
    }

    const getPlayerColors = () => {
        return gameState.playerStates.reduce<PlayerNameToColor>((acc, pState) => {
            return { ...acc, [pState.name]: pState.color };
        }, {});
    }

    return (
        <MainDiv>
            <WordLayout>
                <WordComponent
                word={gameState.revealedWord}
                isSolved={gameState.isRoundDone}
                okClicked={setPlayerDone}></WordComponent>
                <TimerComponent timeLeftInSeconds={gameState.secondLeftInRound} />
            </WordLayout>
            <HorizontalDiv>
                <ImageComponent imageClicked={handleImageDoubleClick} imageUrls={gameState.imagesUrls}></ImageComponent>
                <VerticalLayout>
                    <ChatComponent correctWord={gameState.word} previousQuesses={gameState.previousQuesses} playerColors={getPlayerColors()} ></ChatComponent>
                    <LetterSelectComponent revealWord={(quess) => handleNewQuess(quess)} 
                    isDisabled={gameState.isRoundDone || gameState.secondLeftInRound === 0}></LetterSelectComponent>
                </VerticalLayout>
            </HorizontalDiv>

            <PlayerInfoContainer>
                {
                    gameState.playerStates.map(playerState => (
                        <PlayerInfo key={playerState.name} isActive={false} name={playerState.name} points={playerState.points} ></PlayerInfo>
                    ))
                }
                <ConcedeButton isConcedeBtnDisabled={isConcededButtonDisabled()} disabled={isConcededButtonDisabled()} onClick={setPlayerConceded}>Concede</ConcedeButton>
            </PlayerInfoContainer>
            {zoomedImgUrl ? <ImageWindow imageClicked={handleImageSingleClick} imageSrc={zoomedImgUrl}></ImageWindow> : <></>}
        </MainDiv>
    );
}

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    justify-content: center;
`;

const WordLayout = styled.div`
    display: flex;
    flex-direction: row;
    width: 810px;
    justify-content: center;
`;

const HorizontalDiv = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    margin-top:10px;
    background: #0b242a;
    padding: 15px;
    max-height: 604px;
    box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
-webkit-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
-moz-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.75);
rgba(0,0,0,0.75);
    border-radius: 5px;
    border: 1px solid #5c5757;
`;

const VerticalLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`;

const PlayerInfoContainer = styled.div`
    position: fixed;
    right: 30px;
    background: #0b242a;
    padding-left: 9px;
    padding-bottom: 11px;
    border-top-left-radius: 8px;
    border: 1px solid #5c5757;
`;

const ConcedeButton = styled.button`
background: #640404;
padding: 10px;
margin-left: 10px;
border-radius: 3px;
color: white;
border: ${props => props.isConcedeBtnDisabled ? '2px solid green' : '2px solid white'};
font-weight: bold;
`;