import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlayerNameToColor, timeBasedLetterReveal } from '../types/types';
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
    //const [timeLeftInRound, setTimeLeftInRound] = useState(120);
    //const [timeUpdateInterval, setTimeUpdateInterval] = useState<NodeJS.Timeout>();

    /*
    useEffect( () => {
        
        if( !timeUpdateInterval ) {
            const iv = setInterval( () => setTimeLeftInRound(timeLeftInRound => timeLeftInRound !== 0 ? timeLeftInRound-1 : 0),1000);
            setTimeUpdateInterval(iv);
        }

        setTimeLeftInRound(gameState.secondLeftInRound);
    },[gameState.secondLeftInRound,timeUpdateInterval]);
*/
    const getRevealedBestQuess = () => {

        let bestQuess = revealLettersBasedOnTime().revealedString;

        if (!gameState.previousQuesses) return bestQuess;

        gameState.previousQuesses.forEach(quess => {
            const revealStr = getRevealedQuess(quess.text);
            if (revealStr.length > bestQuess.length)
                if( bestQuess.length < revealStr.length )
                    bestQuess = revealStr;
        })

        return bestQuess;
    };
    
    const revealLettersBasedOnTime = () : timeBasedLetterReveal => {
        const percentageOfTime = (120-gameState.secondLeftInRound) / 120; // TODO: fix hardcoded max round time
        const lettersToBeRevealed = Math.round(gameState.word.length * percentageOfTime);
        const revealedString = revealLetters( (word,i) => i <= lettersToBeRevealed );
        return {
            revealedString,
            revealedLetterCount : revealLetters.length
        }
    };

    const revealLetters = (doRevealLetter : (word: string, i : number) => boolean) => {
        return Array.from(gameState.word).reduce( (revealed, letter,idx) => {
            if( doRevealLetter(gameState.word,idx) )
                revealed += letter;
            return revealed;
        },'');
    };

    const getRevealedQuess = (quess: string) => {

        let revealedLetterCount = 0;
        let retStr = revealLetters((word, i) => {
            if( quess.length <= i || gameState.word.length <= i ) return false;
            
            const doReveal = gameState.word[i].toLowerCase() === quess[i].toLowerCase()
            if( doReveal ) revealedLetterCount++;
            return doReveal;
        });

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

    const getPlayerColors  = () => {
        return gameState.playerStates.reduce<PlayerNameToColor>( (acc, pState) => {
            return { ...acc, [pState.name]: pState.color};
        },{});
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
                    <ChatComponent previousQuesses={gameState.previousQuesses} playerColors={getPlayerColors()} ></ChatComponent>
                    <LetterSelectComponent revealWord={(quess) => handleNewQuess(quess)} isDisabled={gameState.isRoundDone}></LetterSelectComponent>
                </VerticalLayout>
            </HorizontalDiv>

            <PlayerInfoContainer>
                <TimeDiv>
                    {gameState.secondLeftInRound}
                </TimeDiv>                
                {
                    gameState.playerStates.map( playerState => (
                        <PlayerInfo key={playerState.name} isActive={false} name={playerState.name} points={playerState.points} ></PlayerInfo>
                    ))
                }
                <ConcedeButton isConcedeBtnDisabled={isConcededButtonDisabled()} disabled={isConcededButtonDisabled()} onClick={setPlayerConceded}>Concede</ConcedeButton>
            </PlayerInfoContainer>
            {zoomedImgUrl ? <ImageWindow imageClicked={handleImageSingleClick} imageSrc={zoomedImgUrl}></ImageWindow> : <></>}
        </MainDiv>
    );
}

const TimeDiv = styled.div`
color: #ffeaea;
padding: 10px;
text-align: center;
background: #142828;
font-weight: bold;
font-size: 16px;
border: 1px inset white;
`;

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