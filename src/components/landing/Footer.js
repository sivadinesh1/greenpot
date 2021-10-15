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
		props.onHadle(event.target.childNodes[0].data, position, "Footer")

	}

	return (
		<>
			<Content key={key} onClick={(event) => handleEvent(event, 0)}>{data}</Content>
		</>
	);
};

export default Footer;
