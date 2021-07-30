import { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../auth';
import React from 'react';

const Private = ({ children }) => {
	useEffect(() => {
		if (!isAuth()) {
			Router.push(`/`);
		}
	}, []);
	return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
