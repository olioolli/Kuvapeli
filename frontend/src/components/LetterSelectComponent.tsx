import React, { useState } from 'react';
import styled from 'styled-components';

export type LetterSelectComponentProps = {
    revealWord : (string) => void;
    isEnabled: boolean
};

export const LetterSelectComponent = (props : LetterSelectComponentProps) => {

    const [ selectedWord, setSelectedWord ] = useState("");

    const handleWordInputValueChange = (event) => {
        setSelectedWord(event.target.value.toUpperCase());
    }

    const handleQuessWordClicked = () => {
        if( selectedWord !== '' ) {
            props.revealWord(selectedWord);
            setSelectedWord('');
        }
    }

    return (
        <LetterSelectMainDiv>
            <HorizontalLayout>
                <WordInput onInput={ handleWordInputValueChange } value={selectedWord}></WordInput>
                <Button disabled={props.isEnabled} onClick={ handleQuessWordClicked }>Quess</Button>
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
    margin-top:25px;
`;

const WordInput = styled.input`
    height: 60px;
    background: #0c2626;
    color: white;
    border: 1px solid #d1bcbc;
    border-radius: 5px;
    resize: none;
`;

const Button = styled.button`
    height: 66px;
    margin-left: 1px;
`;