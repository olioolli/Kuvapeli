import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PlayerNameToColor, PreviousQuess } from '../types/types';

export type ChatComponentProps = {
    previousQuesses : PreviousQuess[]
    playerColors: PlayerNameToColor; 
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
                    <QuessDiv key={idx}>
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
`;

const QuessDiv = styled.div`
display: flex;
`;