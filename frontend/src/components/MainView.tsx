import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useGameState } from '../util/GameStateProvider';
import { getCurrentPlayerName } from '../util/utils';
import { ChatComponent } from './ChatComponent';
import { ImageComponent } from './ImageComponent';
import { ImageWindow } from './ImageWindow';
import { LetterSelectComponent } from './LetterSelectComponent';
import { PlayerInfo } from './PlayerInfoComponent';
import { WordComponent } from './WordComponent';

export const MainView = () => {

    const { gameState, updateGameState, setPlayerDone, setPlayerConceded } = useGameState();
    const [zoomedImgUrl, setZoomedImgUrl] = useState<string | undefined>();

    const getRevealedBestQuess = () => {
        let bestQuess: string | undefined = undefined;
        if (!gameState.previousQuesses) return;

        gameState.previousQuesses.forEach(quess => {
            const revealStr = getRevealedQuess(quess.text);
            if (!bestQuess || revealStr.length > bestQuess.length)
                bestQuess = revealStr;
        })

        return bestQuess;
    };

    const getRevealedQuess = (quess: string) => {
        let retStr = '';
        for (let i = 0; i < quess.length && i < gameState.word.length; i++) {
            if (gameState.word[i].toLowerCase() === quess[i].toLowerCase())
                retStr += gameState.word[i];
            else
                break;
        }

        if (retStr.length === gameState.word.length)
            return retStr;
        else
            return retStr + "..";
    }

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
        return gameState.playerStates.filter( pState => pState.name === playerName )[0]?.isConceded;
    }
    
    return (
        <MainDiv>
            <WordComponent
                word={gameState.isRoundDone ? gameState.word : getRevealedBestQuess()}
                isSolved={gameState.isRoundDone}
                okClicked={setPlayerDone}></WordComponent>
            <HorizontalDiv>
                <ImageComponent imageClicked={handleImageDoubleClick} imageUrls={gameState.imagesUrls}></ImageComponent>
                <VerticalLayout>
                    <ChatComponent previousQuesses={gameState.previousQuesses}></ChatComponent>
                    <LetterSelectComponent revealWord={(quess) => handleNewQuess(quess)} isDisabled={gameState.isRoundDone}></LetterSelectComponent>
                </VerticalLayout>
            </HorizontalDiv>

            <PlayerInfoContainer>
                {
                    gameState.playerStates.map(playerState => (
                        <PlayerInfo isActive={false} name={playerState.name} points={playerState.points} ></PlayerInfo>
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

const HorizontalDiv = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    margin-top:10px;
`;

const VerticalLayout = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`;

const PlayerInfoContainer = styled.div`
    position: fixed;
    right: 30px;
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