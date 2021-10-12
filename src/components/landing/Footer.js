import React, { Fragment } from 'react';

const Footer = (props) => {
	const { data, key } = props
	return (
		<>
			<div key={key}>{data}</div>
		</>
	);
};

export default Footer;
