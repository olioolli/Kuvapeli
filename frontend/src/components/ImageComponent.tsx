import React, { useCallback, useState } from 'react';
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
                props.imageUrls.map( url => (
                    <Image onClick={handleImageClick} src={url}></Image>
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
`;

const Image = styled.img`
    width: 300px;
    height: 300px;

    &:hover {
        opacity:0.8;
    }
`;