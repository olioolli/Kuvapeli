import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PlayerNameToColor, PreviousQuess } from '../types/types';

export type ChatComponentProps = {
    previousQuesses : PreviousQuess[]
    playerColors: PlayerNameToColor; 
    correctWord: string;
}

export const ChatComponent = (props : ChatComponentProps) => {

    const mainDiv = useRef<HTMLDivElement>();

    useEffect( () => {
        mainDiv.current?.scroll(0,10000);
    });

    return (
        <MainDiv ref={mainDiv}>
            {
                props.previousQuesses.map( (quess, idx) => (
                    <QuessDiv correctQuess={quess.text.toLowerCase() === props.correctWord.toLowerCase()} key={idx}>
                        <PlayerDiv style={ { color: props.playerColors[quess.player]} }>{quess.player+":"}</PlayerDiv>
                        {quess.text}
                    </QuessDiv>
                ))
            }
        </MainDiv>
    );
}

const PlayerDiv = styled.div`
color: ${props => props.color};
font-style: normal;
margin-right: 4px;
`;

const MainDiv = styled.div`
    color: white;
    border: 1px solid;
    padding: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    height: 508px;
    border: 1px solid #5c5757;
`;

const QuessDiv = styled.div`
display: flex;
font-style: italic;

background: ${props => props.correctQuess ? "#0b640a" : "none"};
padding: ${props => props.correctQuess ? "2px" : "none"};
border-radius: ${props => props.correctQuess ? "3px" : "none"};
border: ${props => props.correctQuess ? "1px solid #6ccf6c" : "none"};
padding-left: ${props => props.correctQuess ? "4px" : "none"};
padding-right: ${props => props.correctQuess ? "4px" : "none"};
`;