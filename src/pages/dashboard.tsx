import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Router from 'next/router';

import axios from 'axios';

import useSWR from 'swr';
import styles from '../styles/dashboard.module.scss';
import Image from 'next/image';
import { forceLogout } from '../components/auth/auth';
import RepoSidebar from '../components/RepoSidebar';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TemplateList from '../components/template/ListTemplates';

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let repos = null;
	let blogs = null;
	let company_id = null;
	let repo_id = null;

	try {
		cookie = context?.req?.headers.cookie;

		let result = await axios.get(`${process.env.API_URL}/blog/reposummary`, {
			headers: {
				cookie: cookie!,
			},
		});
		repos = result.data;
		repo_id = repos[0].id;

		// fetch blogs
		let result1 = await axios.get(`${process.env.API_URL}/blog/repo/${repo_id}`, {
			headers: {
				cookie: cookie!,
			},
		});

		blogs = result1.data;
	} catch (error) {
		console.log(`error in dashboard ${error}`);

		isError = true;
	}

	return {
		props: { repos, company_id, blogs, repo_id, isError },
	};
};

const Dashboard = ({ repos, company_id, blogs, repo_id, isError }) => {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	console.log("test repo result --->",repos)
	const [selectedRepo, setSelectedRepo] = useState(repos ? repos[0] : null);

	const {
		data: blogarr,
		mutate,
		error,
	} = useSWR(`/api/blog/repo/${selectedRepo?.id}`, {
		initialData: blogs,
	});

	const [blogItem, setBlogItem] = useState<any>();

	const {
		data: repoarr,
		mutate: mutaterepo,
		error: errorrepo,
	} = useSWR(`/api/repository/${company_id}`, {
		initialData: repos,
	});

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setBlogItem(item);
	};

	const editBlog = (item) => {
		Router.push(`/admin/blog-edit/${item.blog_id}`);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleBlogDelete = async () => {
		setAnchorEl(null);
		handleOpenDialog();
	};

	const confirmBlogDelete = async () => {
		let response = await axios.delete(`/api/blog/${blogItem.id}`);
		handleCloseDialog();
		mutate();
	};

	const handleNewArticle = async (event) => {
		event.stopPropagation();
		const blog = await axios.get(`/api/blog/new/${repos[0].id}`);
		Router.push(`/admin/blog-edit/${blog.data.blog_id}`);
	};

	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	//template dialog
	const [templateDialog, setTemplateDialog] = useState(false);
	const handleOpenTemplate = () => {
		// setTemplateDialog(true);
		Router.push(`/template/${selectedRepo.repo_id}`);
	};

	const handleCloseTemplate = () => {
		setTemplateDialog(false);
	};

	const reloadBlogs = async (repo) => {
		setSelectedRepo(repo);
		mutate();
	};    

	return (
		<>
			{repoarr !== null ? <RepoSidebar repos={repoarr} company_id={company_id} isError={isError} reloadBlogs={reloadBlogs} /> : ''}

			<div className={styles.wrapper}>
				<div className={styles.page_header}>{selectedRepo?.name}</div>
				<div className={styles.repo_list}>
					<div className={styles.repo_creator}>
						<div className={styles.left} onClick={(event) => handleNewArticle(event)}>
							<div>New Article</div>
							<div style={{ placeSelf: 'center' }}>
								<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
							</div>
						</div>
						<div className={styles.right} onClick={(event) => handleOpenTemplate()}>
							<div>New Template</div>
							<div style={{ placeSelf: 'center' }}>
								<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
							</div>
						</div>
					</div>

					{blogarr &&
						blogarr?.map((item, index) => {
							return (
								<div key={index} className={styles.list_blogs}>
									<div className={styles.blog_title} onClick={() => editBlog(item)}>
										{item.title}
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
				<MenuItem onClick={handleBlogDelete}>
					<span style={{ color: 'red', fontSize: '12px' }}>Delete</span>
				</MenuItem>
			</Menu>

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogContent style={{ width: '500px' }}>
					<div className='dialog_pop'>
						<div style={{ fontSize: '20px' }}>Delete this article?</div>
						<div style={{ cursor: 'pointer' }}>
							<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
						</div>
					</div>

					<div className={styles.formGap}>
						<p>
							You are about to delete <b>{blogItem?.title}</b>.
						</p>
						<p>It will be unpublised and deleted and wont be able to revover it.</p>
					</div>

					<div className='action_btns'>
						<Button onClick={handleCloseDialog} disableFocusRipple disableElevation className={styles.cancel_button} style={{ margin: '6px 10px' }}>
							Cancel
						</Button>
						<Button
							variant='contained'
							style={{ margin: '6px 10px', backgroundColor: '#af0404', color: '#fff' }}
							onClick={confirmBlogDelete}
							type='button'
							className={styles.submit_button}
							disableFocusRipple
							disableElevation>
							Yes, delete it
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<div>
				<Dialog fullScreen open={templateDialog} onClose={handleCloseTemplate}>
					{/* <DialogContent style={{ width: '500px' }}>
						<div className={styles.dialog_pop}>
							<div style={{ fontSize: '20px' }}>Create a new workspace</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>
						
						
					</DialogContent> */}
					<TemplateList onHandleClose={handleCloseTemplate} />
				</Dialog>
			</div>
		</>
	);
};

export default Dashboard;
