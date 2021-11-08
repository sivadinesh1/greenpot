import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Divider from '@material-ui/core/Divider';
import { forceLogout } from '../../../components/auth/auth';

import styles from '../../../styles/Template.module.scss';
import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { getRepoByNano } from '../../../service/repository.service';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import styles1 from '../../../styles/Home.module.scss';
import Image from 'next/image';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Header from '../../../components/landing/Header';
import Footer from '../../../components/Footer';
import Builder from '../../../components/Builder';

const ColorButton = withStyles(() => ({
	root: {
		color: '#faf7f7',
		backgroundColor: '#0a0a0a',
		'&:hover': {
			backgroundColor: '#544d4d',
		},
		padding: '5px 40px',
	},
}))(Button);

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let template = null;
	let tempId = null;
	let repoNano = null;
	let repoId = null;
	let company_id = null;

	try {
		cookie = context?.req?.headers.cookie;
		tempId = context.params.slug[1];
		repoNano = context.params.slug[0];

		//fetch templates
		let result2 = await axios.get(`${process.env.API_URL}/template/getByNano/${tempId}`, {
			headers: {
				cookie: cookie!,
			},
		});

		template = result2.data;

		//get repo by nano
		let repo = await getRepoByNano(repoNano);
		repoId = repo.id;
		company_id = repo.company_id;
	} catch (error) {
		console.log(`error in template preview ${error}`);
		isError = true;
	}

	return {
		props: { isError, template, repoId, repoNano, company_id },
	};
};

interface FormData {
	name: string;
}

const TemplatePreview = ({ isError, template, repoId, repoNano, company_id }) => {
	const [temp, setTemp] = useState(template);
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	let schema = yup.object().shape({
		name: yup.string().required().max(70),
	});

	const [data, setData] = useState(temp.blocks);
	const [objKeys, setObjKeys] = useState(Object.keys(data));
	console.log('test keyset', objKeys);

	const {
		register,
		watch,
		reset,
		getValues,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<FormData>({ mode: 'onChange', resolver: yupResolver(schema) });

	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [isDuplicate, setIsDuplicate] = useState(false);
	const [message, setMessage] = useState('')

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		reset();
		setOpenDialog(false);
	};

	const addCustomTemp = (id) => {
		console.log('test Process', id);
		handleOpenDialog();
	};

	const handleCustomTemplate = (nanoId) => Router.push(`/lead-page/research/${nanoId}`);

	const onSubmit = async (formData, event) => {
		const values = {
			templateId: temp.id,
			repoId: repoId,
			name: formData.name,
			company_id: company_id,
		};
		console.log('check lead page submit value--->', values);
		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/lead-page`, values);
		console.log('check response--->', response);
		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		if (response.status === 201) {
			setOpenDialog(false);
			handleCustomTemplate(response.data.lead_page_id);
			event.target.reset();
		} else if (response.status === 200) {
			console.log("check duplicate ---->", response.data)
			showError(true, response.data.message)
		}
	};


	const showError = (flag, data) => {
		setMessage(data);
		setIsDuplicate(flag);
		setTimeout(() => {
			setIsDuplicate(false);
		}, 5000);
	};
	return (
		<>
			<div className={styles.temp_wrap}>
				<div className={styles.left}>
					<div className={styles1.breadcrumb}>
						<Breadcrumbs separator='›' aria-label='breadcrumb'>
							<Link href='/dashboard'>Dashboard</Link>
							<Link href={`/template/${repoNano}`}>Template</Link>
							<Typography color='textPrimary'>Preview</Typography>
						</Breadcrumbs>
					</div>
					<div style={{ padding: '20px' }}>Lead Capture - Template gallery </div>
					<div style={{ marginTop: '5px' }}>
						<Divider />
					</div>
					<div style={{ padding: '20px' }}>Use templates to quickly get started. Modern SEO ready templates for better conversion.</div>
					<div style={{ marginTop: '5px' }}>
						<Divider />
					</div>

					<div style={{ marginTop: '20px', textAlign: 'center' }}>
						<ColorButton onClick={() => addCustomTemp(temp.id)}>Use This Template</ColorButton>
					</div>
				</div>

				<div className={styles.right}>
					<div className={styles.dialog_pop} style={{ marginTop: '40px' }}>
						<div style={{ fontSize: '20px' }}>&emsp;</div>
						<div style={{ cursor: 'pointer', marginRight: '10px' }} onClick={(event) => Router.back()}>
							Back
						</div>
					</div>

					<div className={styles.title}>
						<div>Preview Lead capture Template</div>
						<div style={{ marginTop: '5px' }}>
							<Divider />
						</div>
					</div>

					<div className={styles.body}>
						<Builder data={data} mode='view' />
					</div>
				</div>
			</div>

			<div>
				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogContent style={{ width: '500px' }}>
						<div className={styles1.dialog_pop}>
							<div style={{ fontSize: '20px' }}>&emsp;</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className={styles1.formGap}>
								<div className={styles1.text_wc_wrap}>
									<TextField
										type='text'
										label='Name your template'
										margin='dense'
										name='name'
										variant='standard'
										size='small'
										fullWidth
										{...register('name')}
										InputLabelProps={{
											style: { color: '#0a0a0a' },
										}}
										style={{ borderRadius: '50px' }}
										error={!!errors.name}
									/>
									{isDuplicate && <p>{message}</p>}
								</div>
								<div className='global_errors'>{errors && errors?.name?.message}</div>
							</div>

							<div className={styles1.action_btns}>
								<ColorButton type='submit'>Continue</ColorButton>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};

export default TemplatePreview;
