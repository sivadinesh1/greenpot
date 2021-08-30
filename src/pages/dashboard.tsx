import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Router from 'next/router';

import axios from 'axios';

import RepoList from '../components/crud/Repo/repo-list';
import useSWR, { mutate, trigger } from 'swr';
import styles from '../styles/dashboard.module.scss';
import Image from 'next/image';
import { forceLogout } from '../components/auth/auth';
import RepoSidebar from '../components/RepoSidebar';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

export const getServerSideProps = async (context) => {
	let isError = false;
	const cookie = context?.req?.headers.cookie;
	let repos = null;
	let blogs = null;
	let company_id = null;

	try {
		let result = await axios.get(`${process.env.API_URL}/repository`, {
			headers: {
				cookie: cookie!,
			},
		});
		company_id = result.data.company_id;
		repos = result.data.repos;

		let result1 = await axios.get(`${process.env.API_URL}/blog/repo/${repos[0].repo_id}`, {
			headers: {
				cookie: cookie!,
			},
		});

		blogs = result1.data.blogs;
	} catch (error) {
		isError = true;
	}

	return {
		props: { repos, company_id, isError },
	};
};

const Dashboard = ({ repos, company_id, isError }) => {
	const [message, setMessage] = useState(true);
	const [article, setArticle] = useState({});

	useEffect(() => {
		if (isError) {
			forceLogout();
		}

		if (repos === null) {
			setMessage(false);
		}
	}, []);

	const { data } = useSWR(`/api/repository/${company_id}`, {
		initialData: repos,
	});

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setArticle(item);
	};

	const viewRepo = (item) => {
		debugger;
		Router.push(`/admin/blogs/${item.repo_id}`);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNewArticle = async (event) => {
		event.stopPropagation();
		const blog = await axios.get(`/api/blog/new/${repos[0].id}`);
		Router.push(`/admin/blog-edit/${blog.data.blog_id}`);
	};

	return (
		<>
			<RepoSidebar repos={repos} company_id={company_id} isError={isError} />

			<div className={styles.wrapper}>
				<div className={styles.repo_list}>
					<div className={styles.repo_creator}>
						<div className={styles.left} onClick={(event) => handleNewArticle(event)}>
							<div>New Article</div>
							<div>
								<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
							</div>
						</div>
						<div className={styles.right}>right</div>
					</div>

					{repos &&
						repos?.map((item, index) => {
							return (
								<div key={index} className={styles.list_blogs}>
									<div className={styles.blog_title} onClick={() => viewRepo(item)}>
										{item.name}
									</div>
									<div className={styles.footer}>
										<div>&nbsp;</div>

										<div onClick={(event) => handleClick(event, item)}>
											<Image src='/static/images/three-dots.svg' alt='edit' width='24px' height='24px' />
										</div>
									</div>
								</div>
							);
						})}
				</div>

				{/* <RepoList repos={data} companyId={company_id} /> */}
			</div>
			<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<span style={{ color: 'red', fontSize: '12px' }}>Delete</span>
				</MenuItem>
			</Menu>
		</>
	);
};

export default Dashboard;
