import Navbar from './Navbar';
import Footer from '../components/Footer';

import React from 'react';

const Layout = ({ children }) => {
	return (
		<>
			<Navbar links={true} />
			<div className='global-main'>
				<main>{children}</main>
			</div>

			<Footer />
		</>
	);
};

export default Layout;
