import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { PreviousQuess } from '../types/types';

export type ChatComponentProps = {
    previousQuesses : PreviousQuess[]
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
                    <QuessDiv key={idx}>{quess.player+": "+quess.text}</QuessDiv>
                ))
            }
        </MainDiv>
    );
}

const MainDiv = styled.div`
    color: white;
    border: 1px solid;
    padding: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    height: 600px;
`;

const QuessDiv = styled.div`

`;