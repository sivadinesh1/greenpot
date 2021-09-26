import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@mui/material/Button';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FormInputDropdown } from '../components/forms/FormInputDropdown';
import { FormInputText } from '../components/forms/FormInputText';
import { IRepo } from '../model/Repo';
import styles from '../styles/RepoSidebar.module.scss';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

interface IFormData {
	name: string;
	repo_type: string;
}

const defaultValues = {
	name: '',
	repo_type: '',
};

const RepoSidebar = ({ repos, reloadRepos }) => {
	const [currentRepo, setCurrentRepo] = useState(repos[0]);

	let schema = yup.object().shape({
		name: yup.string().required().max(70),
		repo_type: yup.string().required(),
	});

	const {
		control,
		register,
		watch,
		getValues,
		handleSubmit,
		reset,
		formState: { errors, isDirty, isValid },
	} = useForm<IFormData>({ mode: 'onChange', defaultValues: defaultValues, resolver: yupResolver(schema) });

	const [openDialog, setOpenDialog] = useState(false);

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		reset();
		setOpenDialog(false);
	};

	const onSubmit = async (formData: IFormData) => {
		console.log('Test current data --->', formData);

		const values = {
			name: formData.name,
			repo_type: formData.repo_type,
			status: 'A',
		};

		const response = await axios.post(`/api/repository`, values);

		if (response.data.errors) {
			// log & throw error
			handleSnackOpen('You already have a workspace with this name.');
		}

		if (response.status === 201) {
			handleCloseDialog();
			repos.push(response.data);
			// setCurrentRepo(response.data);
			reloadRepos(response.data);
		}
	};

	const handleRepoSelect = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: IRepo) => {
		event.preventDefault();

		setCurrentRepo(item);
		reloadRepos(item);
		//	reloadBlogs(item);
	};

	const options = [
		{ label: 'Blog', value: 'B' },
		{ label: 'Lead Capture Templates', value: 'T' },
	];

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	return (
		<>
			<nav className={styles.main_menu}>
				<div className={styles.workspace}>
					<div className={styles.label}>Workspaces</div>
					<div className={styles.workspace_right}>
						<div className={styles.plus} onClick={() => handleOpenDialog()}>
							<Image src='/static/images/plus.svg' alt='edit' width='14px' height='14px' />
						</div>
					</div>
				</div>

				{repos.length === 0 && <div className={styles.no_workspace}>Create your first workspace</div>}

				{repos.length > 0 && (
					<>
						{repos &&
							repos?.map((item: IRepo, index: number) => {
								return (
									<div
										key={index}
										className={`${styles.repo_list} ${currentRepo.id === item.id ? styles.highlight_repo : ''} `}
										onClick={(e) => handleRepoSelect(e, item)}>
										<div className={styles.repo_info}>
											<div className={styles.repo_type}>{item.repo_type === 'T' ? 'Landing Pages' : 'Blogs'}</div>
											<div className={styles.repo_stats}>
												{item.repo_type === 'T' ? item.lead_pages_count : item.blog_pages_count}
											</div>
										</div>

										<div className={styles.repo_name}>{item.repo_name}</div>
									</div>
								);
							})}
					</>
				)}

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
							<div style={{ fontSize: '20px' }}>Create new workspace</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>

						<form onSubmit={handleSubmit(onSubmit)}>
							<div className={styles.text_wc_wrap}>
								<FormInputText name='name' control={control} label='Name your new Workspace' />
								<div className={styles.text_wc}>{watch('name', '0')?.length || '0'}/70</div>
							</div>

							<FormInputDropdown
								name='repo_type'
								control={control}
								width={'50%'}
								defaultValue={{ label: '', value: '' }}
								label='Select'
								options={options}
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

			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
					{message}
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default RepoSidebar;
