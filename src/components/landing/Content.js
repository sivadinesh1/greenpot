import React, { Fragment, useState } from 'react';
import Image from 'next/image'
import styled from 'styled-components'
import Option from "./option";

const ContentPage = (props) => {
    let section = "Content";
    const { content, title, key, index, style, mode } = props
    const [mouseOver, setMouseOver] = useState(false)
    const handleMouseOver = (flag) => {
        setMouseOver(flag);
    }

    if (mode === "view")
        style["pointerEvents"] = "none"

    const handleEvent = (event, position) => {
        if (mode === "edit") {
            console.log("check value--->", event);
            event.preventDefault();
            const tags = document.querySelectorAll('.clicked');

            for (let i of tags) {
                i.classList.remove('clicked');
            }

            event.target.classList.add('clicked');
            props.onHandle(event.target.childNodes[0].data, position, index)
        }
    }

    const Content = styled.div`
	margin-top: 40px;
	padding: 20px;
	color: black;
	font-size: 20px;
    ${ mode === "edit" ? `&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}

	&:focus {
		outline-style: solid;
		outline-color: #0000ff;
	}` : ''}
`;

    const Header = styled.div`
padding:10px;
font-size: 35px;
font-weight:bold;
font-family: 'Layout', sans-serif;
color: black;

${ mode === "edit" ? `&:hover {
    outline-style: solid;
    outline-color: #0000ff;
}` : ''}
  `;

    // display: inline-block;
    const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  
  ${ mode === "edit" ? `&:hover {
    outline-style: solid;
    outline-color: #0000ff;
}` : ''}
  `;

    const Container = styled.div`
padding:2rem;
display:grid;
grid-template-columns: 1fr 3fr;
text-align:center;`;
    return (
        <>
            < div onMouseOver={() => handleMouseOver(true)} onMouseOut={() => handleMouseOver(false)}>
                {/* {mouseOver && <Option section={section} />} */}
                {mode === "edit" && <Option sectionName={section} index={index} />}

                < Container style={style}>

                    <Header style={title.style}>
                        <span onClick={(event) => handleEvent(event, 0, "text")}>{title.value}</span>
                    </Header>
                    <div>
                        <Content key={key} style={content.style}>
                            <span onClick={(event) => handleEvent(event, 1, "text")}>{content.value}</span>
                        </Content>
                        <Button>Learn more about our services</Button>
                    </div>

                </Container>
            </div>
        </>
    );
};

export default ContentPage;
