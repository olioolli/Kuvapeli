import React from 'react';
import styled from 'styled-components';

export type TimerComponentProps = {
    timeLeftInSeconds : number;
}

export const TimerComponent = (props : TimerComponentProps) => {

    const getMinutesAndSecondsString = () => { 
        const minutes = Math.floor(props.timeLeftInSeconds / 60);
        const seconds = props.timeLeftInSeconds - (minutes*60);
        return `${minutes > 0 ? "0"+minutes+":" : '00:'}${seconds > 9 ? seconds : seconds !== 0 ? "0"+seconds : '00'}`;
    };

    return (
        <TimeDiv lowTime={props.timeLeftInSeconds < 31}>
            {getMinutesAndSecondsString()}
        </TimeDiv>
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
width: 100px;
color: ${props => props.lowTime ? '#a11515' : '#089520'};
background: #0b242a;
border: 1px solid #5c5757;
border-top-right-radius: 3px;
border-bottom-right-radius: 3px;
border-left: none;
`;