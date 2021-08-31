import Navbar from './RepoSidebar';
import Header from './Header';
import Footer from '../components/Footer';

import React from 'react';

import { state } from '../utils/state';
import { useSnapshot } from 'valtio';

const Layout = ({ children }) => {
	const snap = useSnapshot(state);

	return (
		<>
			{snap.islogged ? <Header username={snap.user.first_name} /> : ''}

			<div className='global-main'>
				<main>{children}</main>
			</div>
		</>
	);
};

export default Layout;
