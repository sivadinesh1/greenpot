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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { ILeadPage } from '../../model/LeadPage'

const TemplateWorkspace = ({ selectedRepo, lead_pages, reload }) => {
	console.log("check selected repo--->", selectedRepo)
	const [view, setView] = React.useState('list');
	const [leadPage, setLeadPage] = useState<ILeadPage>();

	const handleChange = (event, nextView) => {
		setView(nextView);
	};

	const handleOpenTemplate = async (event) => {
		event.stopPropagation();
		Router.push(`/template/${selectedRepo.repo_id}`);
	};

	const handleViewTemplate = () => {
		setAnchorEl(null);
		Router.push(`http://localhost:3000/lead-page/${leadPage.lead_page_id}`)

	}

	// const handleOpenTemplate = () => {
	// 	// setTemplateDialog(true);
	// 	Router.push(`/template/${selectedRepo.repo_id}`);
	// };

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setLeadPage(item);
	};

	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleLeadDelete = async () => {
		setAnchorEl(null);
		handleOpenDialog();
	};

	const confirmDelete = async () => {
		let response = await axios.delete(`/api/lead-page/${leadPage.id}`);
		reload();
		handleCloseDialog();
		//mutate();
	};
	//template dialog
	const [templateDialog, setTemplateDialog] = useState(false);

	const editCusTemp = (ctempId) => {
		Router.push(`/lead-page/research/${ctempId}`);
	};

	const handleCloseTemplate = () => {
		setTemplateDialog(false);
	};

	return (
		<>
			{/* <div className={styles.page_header}>{selectedRepo?.repo_name}</div> */}
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
					<div onClick={(event) => handleOpenTemplate(event)}>
						<span className={styles.plus}>+ New Lead</span>
					</div>
				</div>
			</div>
			<div className={styles.repo_list}>
				{/* <div className={styles.repo_creator}>

					<div className={styles.left} onClick={(event) => handleOpenTemplate()}>
						<div>Landing Page</div>
						<div style={{ placeSelf: 'center' }}>
							<Image src='/static/images/more.svg' alt='edit' width='36px' height='36px' />
						</div>
					</div>
				</div> */}

				{selectedRepo?.repo_type === 'T' &&
					lead_pages &&
					lead_pages?.map((item, index) => {
						console.log('check lead_pages id data---->', item);
						return (
							<div key={index} className={styles.list_blogs}>
								<div className={styles.blog_title} style={{ background: "#c5e0dc" }} onClick={() => editCusTemp(item.lead_page_id)}>
									{item.lead_page_name}
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
				<MenuItem onClick={handleViewTemplate}>view</MenuItem>
				<MenuItem onClick={() => editCusTemp(leadPage.lead_page_id)}>edit</MenuItem>
				<Divider />
				<MenuItem onClick={() => handleLeadDelete()}>
					<span style={{ color: 'red', fontSize: '12px' }}>Delete</span>
				</MenuItem>
			</Menu>

			{openDialog && (
				<DeleteDialog
					open={openDialog}
					handleClose={handleCloseDialog}
					windowTitle='Delete this lead-page?'
					deleteMessage='It will be un-published and deleted and wont be able to recover it.'
					title={leadPage?.lead_page_name}
					confirmDelete={confirmDelete}
				/>
			)}

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
