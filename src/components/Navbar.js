import { signout } from './auth/auth';
import Link from 'next/link';
import Router from 'next/router';

import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Navbar = ({ links, companyid }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignout = () => {
		signout();
		axios.post(`/api/auth/signout`, {}).then(function (response) {
			Router.push(`/`);
		});
	};

	return (
		<>
			<div className={styles.toolbar__wrapper}>
				<div>
					<Link href={`/admin`}>DRAFTY</Link>
				</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{links ? (
						<div style={{ zIndex: '10', position: 'relative', paddingLeft: '16px' }}>
							<FontAwesomeIcon icon={faUser} onClick={handleClick} style={{ fontSize: '2rem', color: '#234' }}></FontAwesomeIcon>

							<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
								<MenuItem onClick={handleClose}>
									<Link href={`/admin/blogs/${companyid}`}>
										<a>Blogs</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<Link href={`/admin/category/${companyid}`}>
										<a>Categories</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<Link href={`/admin/tag/${companyid}`}>
										<a>Tags</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<Link href='/admin/user'>
										<a>User</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>Profile</MenuItem>
								<MenuItem onClick={handleClose}>My account</MenuItem>
								<MenuItem onClick={handleSignout}>Singout</MenuItem>
								{/* <MenuItem onClick={() => signout(() => Router.replace(`/`))}>Singout</MenuItem> */}
							</Menu>
						</div>
					) : (
						''
					)}
				</div>
			</div>
		</>
	);
};

export default Navbar;
