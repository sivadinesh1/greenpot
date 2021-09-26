import Link from 'next/link';
import Router from 'next/router';

import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

import { state } from '../utils/state';
import Image from 'next/image';
import Divider from '@material-ui/core/Divider';

const Header = ({ username = '' }) => {
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
			localStorage.removeItem('user');
			state.islogged = false;
			Router.push(`/`);
		});
	};

	return (
		<>
			<div className={styles.toolbar__wrapper}>
				<div>
					<Link href={`/dashboard`}>
						<a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Image src='/static/images/webb1.svg' alt='edit' width='80px' height='42px' />
						</a>
					</Link>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ zIndex: '10', position: 'relative', display: 'flex', paddingLeft: '16px', cursor: 'pointer' }}>
						<div style={{ padding: '0 0.8rem' }} onClick={handleClick}>
							{username}
						</div>

						<Image src='/static/images/down-arrow.svg' onClick={handleClick} alt='edit' width='12px' height='20px' />

						<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
							<MenuItem onClick={handleClose}>
								<Link href={`/admin/category`}>
									<a>Category</a>
								</Link>
							</MenuItem>

							<MenuItem onClick={handleClose}>
								<Link href={`/admin/tag`}>
									<a>Tags</a>
								</Link>
							</MenuItem>

							<MenuItem onClick={handleClose}>
								<Link href='/admin/user'>
									<a>User</a>
								</Link>
							</MenuItem>

							<MenuItem onClick={handleClose}>
								<Link href='/admin/company'>
									<a>Profile</a>
								</Link>
							</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
							<Divider />
							<MenuItem onClick={handleSignout}>Singout</MenuItem>
							{/* <MenuItem onClick={() => signout(() => Router.replace(`/`))}>Singout</MenuItem> */}
						</Menu>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;
