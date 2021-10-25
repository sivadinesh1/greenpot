import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';

import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

import { state } from '../utils/state';
import Image from 'next/image';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';
import { content } from '../utils/content';
import { useSnapshot } from 'valtio';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';

const Header = ({ username = '' }) => {
	const snap = useSnapshot(content);
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);

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
	const handleView = () => {
		Router.push(`/blog-preview/${router.query.blog_id}`);
	};

	const handleLeadView = () => {
		Router.push(`/lead-page/preview/${router.query.lead_page_id}`);
	};


	const handlePublish = async () => {
		console.log('handle publish method call--->', snap.obj);
		let requestBody = {
			status: 'P',
			published_status: 'Y',
			blog_id: router.query.blog_id,
		};
		if (snap.obj != null) requestBody['content'] = snap.obj;
		let resp = await axios.put(`/api/blog/publish`, requestBody);
		if (resp.status === 200) {
			// Router.push('/dashboard')
			console.log('check data--->', resp.data);
			if (resp.data.isError) {
				setSnack(true);
				setMessage(`Fill the mandatory fields ${resp.data.error} `);
				setIsError(true);
			} else {
				setSnack(true);
				setMessage('blog published successfully');
				Router.push('/dashboard');
			}
		}
	};
	//disable header 
	// let isDisable = router.pathname === "/lead-page/[lead_page_id]" || router.pathname === "/blog/[blog_id]" ? true : false
	let isDisable = router.pathname === "/lead-page/[lead_page_id]" ? true : false

	return (
		<>
			{!isDisable && <div className={styles.toolbar__wrapper}>
				<div>
					<Link href={`/dashboard`}>
						<a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<Image src='/static/images/webb1.svg' alt='edit' width='80px' height='42px' />
						</a>
					</Link>
				</div>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					{router.pathname === '/admin/blog-edit/[blog_id]' && (
						<div style={{ display: 'flex' }}>
							<div onClick={() => handleView()} style={{ display: 'contents', cursor: 'pointer' }}>
								<Image src='/static/images/preview.svg' alt='gallery' width='30px' height='30px' />
							</div>

							<div onClick={() => handlePublish()}>
								<span className={styles.publish}>Publish</span>
							</div>
						</div>
					)}
					{/* lead poage preview option  */}

					{router.pathname === '/lead-page/research/[lead_page_id]' && (
						<div style={{ display: 'flex' }}>
							<div onClick={() => handleLeadView()} style={{ display: 'contents', cursor: 'pointer' }}>
								<Image src='/static/images/preview.svg' alt='gallery' width='30px' height='30px' />
							</div>
						</div>
					)}
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
							{/* <MenuItem onClick={() => signout(() => Router.replace(`/ `))}>Singout</MenuItem> */}
						</Menu>
					</div>
				</div>
			</div>}
			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled' severity={isError ? 'error' : 'success'}>
					{message}
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default Header;
