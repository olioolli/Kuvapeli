import React from 'react';
import styled from 'styled-components';

export type WordComponentProps = {
    imageUrls : string[];
    imageClicked: (string) => void;
}

export const ImageComponent = (props: WordComponentProps) => {

    const handleImageClick = (event : MouseEvent) => {
        const targetImage = event.target as HTMLImageElement;
        props.imageClicked(targetImage.src);
    };

    return (
        <MainDiv>
            {
                props.imageUrls.map( (url,idx) => (
                    <Image key={idx} onClick={handleImageClick} src={url}></Image>
                ))
            }
        </MainDiv>
    );
}

const MainDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    height: 600px;
    width: 600px;
`;

const Image = styled.img`
width: 100%;
height: 100%;
max-width: 300px;
max-height: 300px;
border: 1px solid #919597;
border-style: inset;
border-radius: 3px;

    &:hover {
        opacity:0.8;
    }
`;