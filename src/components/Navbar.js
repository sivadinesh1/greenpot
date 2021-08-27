import Link from 'next/link';
import Router from 'next/router';

import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import { state } from './../pages/state';

const Navbar = () => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignout = () => {
		axios.post(`/api/auth/logout`, {}).then(function (response) {
			localStorage.removeItem('islogged');
			state.islogged = false;
			Router.push(`/`);
		});
	};

	return (
		<>
			<nav className={styles.main_menu}>
				<div># webb</div>
				<ul>
					<li>
						<a href='http://startific.com'>
							<i class='fa fa-envelope-o fa-lg'></i>
							<span className={styles.nav_text}>Contact</span>
						</a>
					</li>
				</ul>
			</nav>
		</>
	);
};

export default Navbar;
