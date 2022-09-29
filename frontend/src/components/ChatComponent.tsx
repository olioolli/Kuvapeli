import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PreviousQuess } from '../types/types';

export type ChatComponent = {
    previousQuesses : PreviousQuess[]
}

export const ChatComponent = (props : ChatComponent) => {

    const mainDiv = useRef<HTMLDivElement>();

    useEffect( () => {
        mainDiv.current?.scroll(0,10000);
    });

    return (
        <MainDiv ref={mainDiv}>
            {
                props.previousQuesses.map( quess => (
                    <QuessDiv>{quess.player+": "+quess.text}</QuessDiv>
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