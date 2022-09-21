import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { PreviousQuess } from '../types/types';

export type ChatComponent = {
    previousQuesses : PreviousQuess[]
}

export const ChatComponent = (props : ChatComponent) => {

    return (
        <MainDiv>
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
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const QuessDiv = styled.div`

`;