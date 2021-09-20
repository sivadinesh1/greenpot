import Link from 'next/link';
import Router from 'next/router';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';

import Image from 'next/image';

import { state } from '../utils/state';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Button from '@mui/material/Button';

interface FormData {
	name: string;
}

const RepoSidebar = ({ repos, company_id, isError, reloadBlogs }) => {
	const [currentRepo, setCurrentRepo] = useState(repos[0]);

	let schema = yup.object().shape({
		name: yup.string().required().max(70),
	});

	const {
		register,
		watch,
		reset,
		getValues,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<FormData>({ mode: 'onChange', resolver: yupResolver(schema) });

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSignout = () => {
		axios.post(`/api/auth/logout`, {}).then(function (response) {
			localStorage.removeItem('islogged');
			state.islogged = false;
			Router.push(`/`);
		});
	};

	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		reset();
		setOpenDialog(false);
	};

	const onSubmit = async (formData, event) => {
		const values = {
			name: formData.name,
			status: 'A',
		};

		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/repository`, values);

		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		if (response.status === 201) {
			// Router.push("/dashboard")
			// handleSnackOpen('Repository Successfully Added');
			setOpenDialog(false);
			//	reloadList();
			event.target.reset();
		}
	};

	const handleRepoSelect = (event, item) => {
		event.preventDefault();

		setCurrentRepo(item);
		reloadBlogs(item);
	};

	const options = [
		{ label: 'Blogs', code: 'B' },
		{ label: 'Templates', code: 'T' },
		{ label: 'Templates', code: 'T' },
		{ label: 'Templates', code: 'T' },
		{ label: 'Templates', code: 'T' },
	];

	// do not delete
	// https://github.com/mui-org/material-ui/issues/7431

	return (
		<>
			<nav className={styles.main_menu}>
				<div className={styles.workspace}>
					<div className={styles.label}>Workspaces</div>
					<div className={styles.workspace_right}>
						<div className={styles.add} onClick={() => handleOpenDialog()}>
							<Image src='/static/images/plus.svg' alt='edit' width='14px' height='14px' />
						</div>
						<div className={styles.search}>
							<Image src='/static/images/search.svg' alt='edit' width='14px' height='14px' />
						</div>
					</div>
				</div>
				{repos &&
					repos?.map((item, index) => {
						return (
							<div
								key={index}
								className={`${styles.repo_list} ${currentRepo.id === item.id ? styles.highlightrepo : ''} `}
								onClick={(e) => handleRepoSelect(e, item)}>
								<div className={styles.name}>{item.name}</div>
								<div className={styles.count}>{item.count}</div>
							</div>
						);
					})}

				<div className={styles.last}>
					<li className={styles.ul}>
						<a className={styles.a} href='http://startific.com'>
							<Image src='/static/images/edit.svg' alt='edit' width='24px' height='24px' />
							<span className={styles.nav_text}>Settings</span>
						</a>
					</li>
				</div>

				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogContent style={{ width: '500px' }}>
						<div className={styles.dialog_pop}>
							<div style={{ fontSize: '20px' }}>Create a new workspace</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className={styles.formGap}>
								<div className={styles.text_wc_wrap}>
									<TextField
										type='text'
										label='Name your new Workspace'
										margin='dense'
										name='name'
										variant='standard'
										size='small'
										fullWidth
										{...register('name')}
										InputLabelProps={{
											style: { color: '#ccc' },
										}}
										style={{ borderRadius: '50px' }}
										error={!!errors.name}
									/>
									<div className={styles.text_wc}>{watch('name', '0')?.length || '0'}/70</div>
								</div>
								<div className='global_errors'>{errors && errors?.name?.message}</div>
							</div>

							<Autocomplete
								disablePortal
								id='combo-box-demo'
								options={options}
								sx={{ width: 300 }}
								renderInput={(params) => <TextField margin='dense' {...params} label='Select content type' />}
							/>

							<div className={styles.action_btns}>
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
									style={{ margin: '6px 10px' }}
									disabled={!isDirty || !isValid}
									type='submit'
									className={styles.submit_button}
									disableFocusRipple
									disableElevation>
									Create workspace
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</nav>
		</>
	);
};

export default RepoSidebar;
