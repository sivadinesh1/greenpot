import React, { Fragment } from 'react';
import Image from 'next/image'
import styled from 'styled-components'

const Content = styled.div`
        margin-top:40px;
        padding:20px;
        color:black;
        font-size:20px;
        &:hover {
          outline-style: solid;
          outline-color: #0000ff;
        }

        &:focus{
            outline-style: solid;
            outline-color: #0000ff;
          }
        `;

const Hero = (props) => {
    const { content, image, key } = props

    const handleEvent = (event, position) => {
        console.log("check value--->", event);
        props.onHadle(event.target.childNodes[0].data, position, "Hero")

    }

    return (
        <>
            <Content key={key} onClick={(event) => handleEvent(event, 0)}>{content}</Content>

            <div id="image">
                <Image
                    src={image}
                    alt="Picture of the author"
                    width={300}
                    height={300} />
            </div>
        </>
    );
};

export default Hero;
