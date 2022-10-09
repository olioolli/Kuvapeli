import React from 'react';
import styled from 'styled-components';

export type ImageWindowProps = {
    imageSrc : string;
    imageClicked: () => void;
}

export const ImageWindow = (props : ImageWindowProps) => {

    return (
        <MainDiv>
            <Image onClick={props.imageClicked} src={props.imageSrc}></Image>
        </MainDiv>
    )
}

const MainDiv = styled.div`
    position: absolute;
    top:0px;
    left:0px;
    z-index: 1000;
    width:100%;
    height:100%;
    display: flex;
    align-content: center;
    justify-content: center;
    background-color: rgba(32, 34, 58, 0.6);
`;

const Image = styled.img`
    height: 100%;
`;