import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Header = styled.div`
	padding: 20px;
	color: ${(props) => props.color};
	font-size: 20px;
	text-align: ${(props) => props.alignment};
	&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}
`;

const Content = styled.div`
	margin-top: 40px;
	padding: 20px;
	color: black;
	font-size: 20px;
	&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}
`;

const HeaderCom = (props) => {
	// const [data,setData]=useState(props.data)
	const { company, blocks, imageUrl, backgroundImage, key } = props;
	let defaultUrl = 'https://res.cloudinary.com/sanjayaalam/image/upload/v1623824061/bei5qfeikwisuvmi4t3c.jpg';
	const handleEvent = (event, position) => {
		console.log('check value--->', event);
		event.preventDefault();

		const tags = document.querySelectorAll('.clicked');

		for (let i of tags) {
			i.classList.remove('clicked');
		}

		event.target.classList.add('clicked');

		// event.target.style.outlineStyle = 'solid';
		// event.target.style.outlineColor = '#0000ff';
		// event.target.style.padding = '1px';

		props.onHadle(event.target.childNodes[0].data, position, 'Header');
	};
	return (
		<>
			<Header color='red' alignment='center'>
				<span onClick={(event) => handleEvent(event, 0, "text")}>{company}</span>
			</Header>
			<div
				style={{
					backgroundImage: `url(${backgroundImage === undefined ? defaultUrl : backgroundImage})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					//   height: "100vh",
				}}
				key={key}>
				<Content>
					<span onClick={(event) => handleEvent(event, 1, "text")}>{blocks}</span>
				</Content>
			</div>
			<div id='image'>
				<Image src={imageUrl === undefined ? defaultUrl : imageUrl} alt='Picture of the author' width={300} height={300} />
			</div>
		</>
	);
};

export default HeaderCom;
