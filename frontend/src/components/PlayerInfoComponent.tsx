import React, { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

export type PlayerInfoProps = {
  isActive: boolean,
  name: string
  points: number;
}

export const PlayerInfo = (props: PlayerInfoProps) => {

  const [points, setPoints] = useState(0);

  useEffect( () => {
    setPoints(props.points);
  },[props.points]);

  return (
    <FlexDivRow>
      <PlayerContainer>
        <PlayerNameDiv>{props.name}</PlayerNameDiv>
        <div>{points + "pts"}</div>
      </PlayerContainer>
    </FlexDivRow>
  )
}
const PlayerNameDiv = styled.div`
  font-weight: bold;
  text-decoration: underline;
  color: #2e4289;
`;

const PlayerContainer = styled.div`
      padding: 10px;  
      min-width: 57px;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      border-radius: 3px;
    & > div {
      display: inline-block;
    }
    `;

const FlexDivRow = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    `;