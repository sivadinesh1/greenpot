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
import { formatDistance } from 'date-fns';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const BlogWorkspace = ({ selectedRepo, blogs, reload }) => {
	useEffect(() => {
		console.log('object... IN BLOG WORKSPACE');
	}, []);
	const [blogItem, setBlogItem] = useState<any>();
	const [openDialog, setOpenDialog] = useState(false);

	const [view, setView] = React.useState('list');

	const handleChange = (event, nextView) => {
		setView(nextView);
	};

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
		Router.push(`/blog-preview/${blogItem.blog_id}`);
	};

	const dateAgo = (date) => {
		return formatDistance(new Date(date), new Date(), { addSuffix: true });

	};

	const toggleFeature = async (item) => {
		let blogRequest = {
			id: item.id,
			is_feature: !item.is_feature
		}
		await axios.put(`/api/blog/updateFeature`, blogRequest);
		reload();

	}

	return (
		<>
			<div className={styles.page_header}>
				<div className={styles.title_header}>{selectedRepo?.repo_name}</div>

				<div className={styles.page_header_right}>
					<div>
						<ToggleButtonGroup orientation='horizontal' value={view} exclusive onChange={handleChange}>
							<ToggleButton value='list' aria-label='list'>
								<ViewListIcon />
							</ToggleButton>
							<ToggleButton value='module' aria-label='module'>
								<ViewModuleIcon />
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
					<div onClick={(event) => handleNewArticle(event)}>
						<span className={styles.plus}>+ New Blog</span>
					</div>
				</div>
			</div>

			{view === 'module' ? (
				<div className={styles.repo_list}>
					{blogs &&
						blogs?.map((item, index) => {
							return (
								<div key={index} className={styles.list_blogs}>
									<div className={styles.thumbnail} onClick={() => editBlog(item)}>
										<Image
											key={index}
											src={item.thumbnail}
											height={176}
											width={280}
											layout='responsive'
											objectFit='cover'
											objectPosition='top center'
										/>
									</div>
									<div className={styles.footer}>
										<div>
											<div className={styles.footer_header}>{item.title}</div>
											<div className={styles.footer_subheader}>{item.author}</div>

											<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
												<div className={styles.footer_subheader}>{dateAgo(item.blog_date)}</div>
												<div className={styles.footer_subheader}>
													{item.status === 'D' && (
														<div className={styles.draft}>
															<span style={{ padding: '0.5rem' }}>Draft</span>
														</div>
													)}
													{item.status === 'P' && (
														<div className={styles.published}>
															<span style={{ padding: '0.5rem' }}>Published</span>
														</div>
													)}
												</div>
											</div>
										</div>
										<div onClick={(event) => handleClick(event, item)}>
											<Image src='/static/images/vertical-three-dots.svg' alt='edit' width='24px' height='24px' />
										</div>
									</div>
								</div>
							);
						})}
				</div>
			) : (
					<div className={styles.table}>
						<div className={styles.table_header}>
							<div>#</div>
							<div>Title</div>
							<div>Feature</div>
							<div>Author</div>
							<div>Created Date</div>
							<div>Status</div>
							<div>&nbsp;</div>
						</div>

						{blogs &&
							blogs?.map((item, index) => {
								return (
									<div key={index} className={styles.table_row} >
										<div onClick={() => editBlog(item)}>{index + 1}</div>
										<div onClick={() => editBlog(item)}>{item.title}</div>
										<div onClick={() => toggleFeature(item)}>{item.is_feature ?
											<Image src='/static/images/star.svg' alt='edit' width='24px' height='24px' />
											: <Image src='/static/images/black-star.svg' alt='edit' width='24px' height='24px' />
										}</div>
										<div onClick={() => editBlog(item)}>{item.author}</div>

										<div onClick={() => editBlog(item)}>{dateAgo(item.blog_date)}</div>

										{item.status === 'D' && <div className={styles.draft} onClick={() => editBlog(item)}>Draft</div>}
										{item.status === 'P' && <div className={styles.published} onClick={() => editBlog(item)}>Published</div>}
										<div className={styles.actions} onClick={(event) => handleClick(event, item)}>
											<Image src='/static/images/vertical-three-dots.svg' alt='edit' width='24px' height='24px' />
										</div>
									</div>
								);
							})}
					</div>
				)}

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
