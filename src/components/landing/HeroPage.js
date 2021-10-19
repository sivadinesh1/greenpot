import React, { Fragment, useState } from 'react';
import Image from 'next/image'
import styled from 'styled-components'
import Option from "./option";

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

const Container = styled.div`
padding:2rem;
background-color:gray;
text-align:center;`;

const Header = styled.div`
padding:10px;
font-size: 35px;
font-family: 'Layout', sans-serif;
color: black;

&:hover {
    outline-style: solid;
    outline-color: #0000ff;
  }`;

// display: inline-block;
const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;

  &:hover {
    outline-style: solid;
    outline-color: #0000ff;
  }
  `;
//   display: block;

const Hero = (props) => {
    let section = "Hero";
    const { title, content, key } = props
    const [mouseOver, setMouseOver] = useState(false)
    const handleMouseOver = (flag) => {
        setMouseOver(flag);
    }

    let image = {
        backgroundImage: `url(https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }


    const handleEvent = (event, position) => {
        console.log("check value--->", event);
        event.preventDefault();
        const tags = document.querySelectorAll('.clicked');

        for (let i of tags) {
            i.classList.remove('clicked');
        }

        event.target.classList.add('clicked');
        props.onHadle(event.target.childNodes[0].data, position, "Hero")

    }

    return (
        <>
            < Container onMouseOver={() => handleMouseOver(true)} onMouseOut={() => handleMouseOver(false)}>
                {/* {mouseOver && <Option section={section} />} */}
                <Option sectionName={section} />
                <Header>
                    <span onClick={(event) => handleEvent(event, 0)}>{title}</span>
                </Header>
                <Content key={key} >
                    <span onClick={(event) => handleEvent(event, 1)}>{content}</span>
                </Content>

                <div style={image}>
                    test
                </div>

                <div>
                    <Button>Click</Button>
                </div>

            </Container>
        </>
    );
};

export default Hero;