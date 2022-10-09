import React, { KeyboardEvent, useState } from 'react';
import styled from 'styled-components';

export type LetterSelectComponentProps = {
    revealWord : (string) => void;
    isDisabled: boolean
};

export const LetterSelectComponent = (props : LetterSelectComponentProps) => {

    const [ selectedWord, setSelectedWord ] = useState("");

    const handleWordInputValueChange = (event) => {
        setSelectedWord(event.target.value.toUpperCase());
    }

    const handleKeyPress = (event : KeyboardEvent) => {
        if( event.code !== 'Enter' && event.code !== 'NumpadEnter') return;

        if( selectedWord !== '' ) {
            props.revealWord(selectedWord);
            setSelectedWord('');
        }
    }

    return (
        <LetterSelectMainDiv>
            <HorizontalLayout>
                <WordInput disabled={props.isDisabled} placeholder={'Enter quess..'} onKeyPress={handleKeyPress} onInput={ handleWordInputValueChange } value={selectedWord}></WordInput>
            </HorizontalLayout>
        </LetterSelectMainDiv>
    );
};

const HorizontalLayout = styled.div`
    display: flex;
    justify-content: center;
`;

const LetterSelectMainDiv = styled.div`
    background: #c3bbbb;
    display: flex;
    flex-direction: column;
    margin-top:5px;
`;

const WordInput = styled.input`
    height: 60px;
    background: #0c2626;
    color: white;
    border: 1px solid #d1bcbc;
    border-radius: 5px;
    resize: none;
    &::placeholder {
        padding-left: 10px;
    }
    padding-left: 10px;
    width: 100%;
`;