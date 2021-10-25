import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';


const HeaderCom = (props) => {
	// const [data,setData]=useState(props.data)
	const { company, blocks, imageUrl, backgroundImage, key, index, style, mode } = props;
	let defaultUrl = 'https://res.cloudinary.com/sanjayaalam/image/upload/v1623824061/bei5qfeikwisuvmi4t3c.jpg';

	if (mode === "view")
		style["pointerEvents"] = "none"

	const handleEvent = (event, position) => {
		console.log('check value--->', event);
		if (mode === "edit") {
			event.preventDefault();

			const tags = document.querySelectorAll('.clicked');

			for (let i of tags) {
				i.classList.remove('clicked');
			}

			event.target.classList.add('clicked');
			props.onHandle(event.target.childNodes[0].data, position, index);
		}
	};

	const Header = styled.div`
	padding: 20px;
	color: ${(props) => props.color};
	font-size: 20px;
	text-align: ${(props) => props.alignment};
	${ mode === "edit" ? `&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}` : ''}
`;

	const Content = styled.div`
	margin-top: 40px;
	padding: 20px;
	color: black;
	font-size: 20px;
	${ mode === "edit" ? `&:hover {
		outline-style: solid;
		outline-color: #0000ff;
	}` : ''}
`;

	return (
		<div style={style}>
			<Header color='red' alignment='center' style={{ ...company.style }}>
				<span onClick={(event) => handleEvent(event, 0, "text")}>{company.value}</span>
			</Header>
			<div
				style={{
					backgroundImage: `url(${backgroundImage === undefined ? defaultUrl : backgroundImage})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					//   height: "100vh",
				}}
				key={key}>
				<Content style={{ ...blocks.style }}>
					<span onClick={(event) => handleEvent(event, 1, "text")}>{blocks.value}</span>
				</Content>
			</div>
			<div id='image'>
				<Image src={imageUrl === undefined ? defaultUrl : imageUrl} alt='Picture of the author' width={300} height={300} />
			</div>
		</div>
	);
};

export default HeaderCom;
