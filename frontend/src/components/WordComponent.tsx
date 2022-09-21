import React, { useCallback, useEffect, useState } from 'react';
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
    });

    return (
        <MainDiv>
            <div>{props.word || ''}</div>
            {props.isSolved ? 
            <button 
            disabled={isOkClicked} 
            style={ buttonStyle } 
            onClick={handleOkClicked}>OK</button> : <></>}
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
`;