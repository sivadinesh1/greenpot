// import { signout, isAuth, getCompany } from '../components/auth/auth';
import { signout, isAuth, getCompany } from './auth/auth';
import Link from 'next/link';
import Router from 'next/router';

import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Navbar = ({ links }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [profile, setProfile] = useState('');
	const [companyId, setCompanyId] = useState('');

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		if (isAuth() && isAuth().role === '1') {
			setProfile('Admin');
		} else {
			setProfile('User');
		}
		setCompanyId(getCompany());
	}, []);

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
					<div>{profile}</div>
					{links ? (
						<div style={{ zIndex: '10', position: 'relative', paddingLeft: '16px' }}>
							<FontAwesomeIcon icon={faUser} onClick={handleClick} style={{ fontSize: '2rem', color: '#234' }}></FontAwesomeIcon>

							<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
								<MenuItem onClick={handleClose}>
									<Link href={`/admin/blogs/${companyId}`}>
										<a>Blogs</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<Link href={`/admin/category/${companyId}`}>
										<a>Categories</a>
									</Link>
								</MenuItem>

								<MenuItem onClick={handleClose}>
									<Link href={`/admin/tag/${companyId}`}>
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
