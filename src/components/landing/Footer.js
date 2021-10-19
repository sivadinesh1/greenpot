import React, { Fragment } from 'react';

import styled from 'styled-components'

const Content = styled.div`
        margin-top:40px;
        padding:20px;
        color:black;
        font-size:20px;
        &:hover{
          outline-style: solid;
          outline-color: #0000ff;
        }
        `;

const Footer = (props) => {
	const { data, key } = props
	const handleEvent = (event, position) => {
		console.log("check value--->", event);
		event.preventDefault();
		const tags = document.querySelectorAll('.clicked');

		for (let i of tags) {
			i.classList.remove('clicked');
		}

		event.target.classList.add('clicked');
		props.onHadle(event.target.childNodes[0].data, position, "Footer")

	}

	return (
		<>
			<Content key={key} >
				<span onClick={(event) => handleEvent(event, 0, "text")}>{data}</span>
			</Content>
		</>
	);
};

export default Footer;
