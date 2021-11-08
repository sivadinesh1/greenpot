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
import { formatDistance } from 'date-fns';


const TemplateWorkspace = ({ selectedRepo, lead_pages, reload }) => {
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
		Router.push(`/lead-page/pre-view/${leadPage.slug}`)
	}

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

	const dateAgo = (date) => {
		return formatDistance(new Date(date), new Date(), { addSuffix: true });
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

			{view === 'module' ? (
				<div className={styles.repo_list}>
					{selectedRepo?.repo_type === 'T' &&
						lead_pages &&
						lead_pages?.map((item, index) => {
							console.log('check lead_pages id data---->', item);
							return (
								<div key={index} className={styles.list_blogs}>
									<div className={styles.thumbnail} onClick={() => editCusTemp(item.lead_page_id)}>
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
											<div className={styles.footer_header}>{item.lead_page_name}</div>
											<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
												<div className={styles.footer_subheader}>{dateAgo(item.createdAt)}</div>
												<div className={styles.footer_subheader}>
													{item.status === 'A' && (
														<div className={styles.published}>
															<span style={{ padding: '0.5rem' }}>Active</span>
														</div>
													)}
													{item.status === 'I' && (
														<div className={styles.in_active}>
															<span style={{ padding: '0.5rem' }}>InActive</span>
														</div>
													)}
												</div>
											</div>
										</div>
										<div onClick={(event) => handleClick(event, item)}>
											<Image src='/static/images/three-dots.svg' alt='edit' width='24px' height='24px' />
										</div>
									</div>
								</div>
								// <div key={index} className={styles.list_blogs}>
								// 	<div className={styles.blog_title} style={{ background: "#c5e0dc" }} onClick={() => editCusTemp(item.lead_page_id)}>
								// 		{item.lead_page_name}
								// 	</div>
								// 	<div className={styles.footer}>
								// 		<div>&nbsp;</div>

								// 		<div onClick={(event) => handleClick(event, item)}>
								// 			<Image src='/static/images/three-dots.svg' alt='edit' width='24px' height='24px' />
								// 		</div>
								// 	</div>
								// </div>
							);
						})}
				</div>
			) : (
					<div className={styles.table}>
						<div className={styles.table_header}>
							<div>#</div>
							<div>Name</div>
							<div style={{ paddingLeft: "10px" }}>Type</div>
							<div>Created Date</div>
							<div style={{ paddingLeft: "15px" }}>Status</div>
							<div>&nbsp;</div>
						</div>

						{lead_pages &&
							lead_pages?.map((item, index) => {
								return (
									<div key={index} className={styles.table_row} >
										<div onClick={() => editCusTemp(item.lead_page_id)}>{index + 1}</div>
										<div onClick={() => editCusTemp(item.lead_page_id)}>{item.lead_page_name}</div>
										{item.template_type === 'B' && <div onClick={() => editCusTemp(item.lead_page_id)}>Blog</div>}
										{item.template_type === 'L' && <div onClick={() => editCusTemp(item.lead_page_id)}>Landing Page</div>}
										<div onClick={() => editCusTemp(item.lead_page_id)}>{dateAgo(item.createdAt)}</div>

										{item.status === 'P' && <div className={styles.draft} onClick={() => editCusTemp(item.lead_page_id)}>Published</div>}
										{item.status === 'A' && <div className={styles.draft} onClick={() => editCusTemp(item.lead_page_id)}>Active</div>}
										{item.status === 'I' && <div className={styles.published} onClick={() => editCusTemp(item.lead_page_id)}>InActive</div>}
										<div className={styles.actions} onClick={(event) => handleClick(event, item)}>
											<Image src='/static/images/vertical-three-dots.svg' alt='edit' width='24px' height='24px' />
										</div>
									</div>
								);
							})}
					</div>
				)}


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

			<div>
				<Dialog fullScreen open={templateDialog} onClose={handleCloseTemplate}>
					{/* <TemplateList onHandleClose={handleCloseTemplate} /> */}
				</Dialog>
			</div>
		</>
	);
};

export default TemplateWorkspace;
