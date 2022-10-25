import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export type WordComponentProps = {
    word : string | undefined;
    isSolved: boolean;
    okClicked : () => void;
}

export const WordComponent = (props : WordComponentProps) => {

    const [ isOkClicked, setOkClicked ] = useState(false);

    const buttonStyle = isOkClicked ? { border : "5px solid green"} : {};

    const handleOkClicked = () => {
        setOkClicked(true);
        props.okClicked();
    };

    useEffect( () => {
        if( !props.isSolved )
            setOkClicked(false);
    },[setOkClicked, props.isSolved]);

    return (
        <MainDiv>
            <div>{props.word ? props.isSolved ? props.word : props.word+".." : ''}</div>
            {props.isSolved ? 
            <Button 
            disabled={isOkClicked} 
            style={ buttonStyle } 
            onClick={handleOkClicked}>OK</Button> : <></>}
        </MainDiv>
    );
}

const MainDiv = styled.div`
    color: white;
    border: 1px solid;
    padding: 11px;
    width: 30%;
    display: flex;
    justify-content: center;
    border: 1px solid #5c5757;
    background: #0b242a;
    border-radius: 5px;
    width: 400px;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
`;

const Button = styled.div`

margin-left: 10px;
background: #089520;
border: 1px solid black;
border-radius: 5px;
font-size: 12px;
height: 14px;
padding-top: 2px;
padding-bottom: 4px;
padding-left: 3px;
padding-right: 5px; 
    &:hover {
        opacity: 0.5;
    }
`;