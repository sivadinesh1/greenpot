
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import Option from './option';
import NextImage from 'next/image';
import styles from '../../styles/components/HeroPage.module.scss'

const Content = styled.div`
	margin-top: 40px;
	padding: 20px;
	color: black;
	font-size: 20px;
	&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}

	&:focus {
		outline-style: solid;
		outline-color: #0000ff;
	}
`;

const Container = styled.div`
padding:2rem;
text-align:center;`;


const Header = styled.div`
	padding: 10px;
	font-size: 35px;
	font-family: 'Layout', sans-serif;
	color: black;

	&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}
`;

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

const Image = styled.div`
	padding: 10px;

	&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}
`;
//   display: block;

const Hero = (props) => {
    let section = 'Hero';
    const { title, content, index, key, backgroundImage, style } = props;
    console.log('check index value ----->', index);
    const [mouseOver, setMouseOver] = useState(false);
    const handleMouseOver = (flag) => {
        setMouseOver(flag);
    };

    let image = {
        backgroundImage: `https://images.pexels.com/photos/34153/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    };

    const handleEvent = (event, position, type) => {
        console.log('check value--->34', event);
        event.preventDefault();
        const tags = document.querySelectorAll('.clicked');
        for (let i of tags) {
            i.classList.remove('clicked');
        }

        event.target.classList.add('clicked');
        // props.onHadle(event.target.childNodes[0].data, position, "Hero")
        props.onHadle(type === 'image' ? event.target.currentSrc : event.target.childNodes[0].data, position, index, type);
    };

    return (
        <div className={styles.imageStack}>
            <div className={styles.imageBottom}>
                {/* <div className={styles.background}> */}
                <NextImage
                    alt="Mountains"
                    src="https://res.cloudinary.com/sanjayaalam/image/upload/v1623820647/idy39zokhlt1m5nvrjek.jpg"
                    layout="responsive"
                    width={700}
                    height={475}
                // quality={100}
                />
            </div>
            {/* <div className={styles.contentTop} > */}
            <Container style={style} onMouseOver={() => handleMouseOver(true)} onMouseOut={() => handleMouseOver(false)}>
                {/* {mouseOver && <Option section={section} index={index} />} */}
                {<Option section={section} index={index} />}
                <Header style={title.style}>
                    <span onClick={(event) => handleEvent(event, 0, 'text')}>{title.value}</span>
                </Header>
                <Content key={key} style={content.style}>
                    <span onClick={(event) => handleEvent(event, 1, 'text')}>{content.value}</span>
                </Content>

                <Image onClick={(event) => handleEvent(event, 2, 'image')}>
                    <img src={backgroundImage} />
                    {/* <div style={image}></div> */}
                </Image>

                <div>
                    <Button>Click</Button>
                </div>
            </Container>
            {/* </div> */}

        </div>
    );
};

export default Hero;
