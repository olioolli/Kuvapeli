import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

export type WordComponentProps = {
    imageUrls : string[];
}

export const ImageComponent = (props: WordComponentProps) => {

    return (
        <MainDiv>
            {
                props.imageUrls.map( url => (
                    <Image src={url}></Image>
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
    width: 200px;
    height: 200px;
`;