import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Router from 'next/router';

import styles from '../../styles/dashboard.module.scss';
import useSWR from 'swr';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import DeleteDialog from '../elements/ui/Dialog/DeleteDialog';

const BlogWorkspace = ({ selectedRepo, blogs, reload }) => {
	useEffect(() => {
		console.log('object... IN BLOG WORKSPACE');
	}, []);

	const [blogItem, setBlogItem] = useState<any>();
	const [openDialog, setOpenDialog] = useState(false);

	const handleNewArticle = async (event) => {
		event.stopPropagation();
		const blog = await axios.get(`/api/blog/new/${selectedRepo.id}`);
		Router.push(`/admin/blog-edit/${blog.data.blog_id}`);
	};

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleBlogDelete = async () => {
		setAnchorEl(null);
		handleOpenDialog();
	};

	const confirmDelete = async () => {
		let response = await axios.delete(`/api/blog/${blogItem.id}`);
		reload();
		handleCloseDialog();
		//mutate();
	};

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setBlogItem(item);
	};

	const editBlog = (item) => {
		Router.push(`/admin/blog-edit/${item.blog_id}`);
	};

	const handleBlogView = () => {
		setAnchorEl(null);
		Router.push(`/admin/blog/${blogItem.blog_id}`)
	}

	return (
		<>
			<div className={styles.page_header}>{selectedRepo?.repo_name}</div>
			<div className={styles.repo_list}>
				<div className={styles.repo_creator}>
					{selectedRepo?.repo_type === 'B' && (
						<div className={styles.left} onClick={(event) => handleNewArticle(event)}>
							<div>New Blog Article</div>
							<div style={{ placeSelf: 'center' }}>
								<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
							</div>
						</div>
					)}
				</div>

				{selectedRepo?.repo_type === 'B' &&
					blogs &&
					blogs?.map((item, index) => {
						return (
							<div key={index} className={styles.list_blogs}>
								{/* <div className={styles.blog_title} onClick={() => editBlog(item)}>
									{item.title}
								</div> */}
								<div className={styles.thumbnail} onClick={() => editBlog(item)}>
									<Image src={item.thumbnail} height='155px' width='180px' />
									<div>{item.title}</div>
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
			{openDialog && (
				<DeleteDialog
					open={openDialog}
					handleClose={handleCloseDialog}
					windowTitle='Delete this article?'
					deleteMessage='It will be un-published and deleted and wont be able to recover it.'
					title={blogItem?.title}
					confirmDelete={confirmDelete}
				/>
			)}

			<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
				<MenuItem onClick={handleBlogView}>View</MenuItem>
				<Divider />
				<MenuItem onClick={handleBlogDelete}>
					<span style={{ color: 'red', fontSize: '12px' }}>Delete</span>
				</MenuItem>
			</Menu>

			{/* <Dialog open={openDialog} onClose={handleCloseDialog}>
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
						<Button
							onClick={handleCloseDialog}
							disableFocusRipple
							disableElevation
							className={styles.cancel_button}
							style={{ margin: '6px 10px' }}>
							Cancel
						</Button>
						<Button
							variant='contained'
							style={{ margin: '6px 10px', backgroundColor: '#af0404', color: '#fff' }}
							// onClick={confirmBlogDelete}
							type='button'
							className={styles.submit_button}
							disableFocusRipple
							disableElevation>
							Yes, delete it
						</Button>
					</div>
				</DialogContent>
			</Dialog> */}
		</>
	);
};

export default BlogWorkspace;
