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

const TemplateWorkspace = ({ selectedRepo, lead_pages }) => {
	const handleNewArticle = async (event) => {
		event.stopPropagation();
		const blog = await axios.get(`/api/blog/new/${selectedRepo.id}`);
		Router.push(`/admin/blog-edit/${blog.data.blog_id}`);
	};

	const handleOpenTemplate = () => {
		// setTemplateDialog(true);
		Router.push(`/template/${selectedRepo.repo_id}`);
	};

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event, item) => {
		// setAnchorEl(event.currentTarget);
		// setBlogItem(item);
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

	const editCusTemp = (ctempId) => {
		//	Router.push(`/custom-template/${ctempId}`);
	};

	const handleCloseTemplate = () => {
		setTemplateDialog(false);
	};

	return (
		<>
			<div className={styles.page_header}>{selectedRepo?.repo_name}</div>
			<div className={styles.repo_list}>
				<div className={styles.repo_creator}>
					{selectedRepo?.repo_type === 'T' && (
						<div className={styles.left} onClick={(event) => handleOpenTemplate()}>
							<div>Landing Page</div>
							<div style={{ placeSelf: 'center' }}>
								<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
							</div>
						</div>
					)}
				</div>

				{selectedRepo?.repo_type === 'T' &&
					lead_pages &&
					lead_pages?.map((item, index) => {
						console.log('check lead_pages id data---->', item);
						return (
							<div key={index} className={styles.list_blogs}>
								<div className={styles.blog_title} onClick={() => editCusTemp(item.lead_page_id)}>
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

			<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
				<MenuItem onClick={handleClose}>Profile</MenuItem>
				<MenuItem onClick={handleClose}>My account</MenuItem>
				<Divider />
				<MenuItem>
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
			<div>
				<Dialog fullScreen open={templateDialog} onClose={handleCloseTemplate}>
					{/* <TemplateList onHandleClose={handleCloseTemplate} /> */}
				</Dialog>
			</div>
		</>
	);
};

export default TemplateWorkspace;
