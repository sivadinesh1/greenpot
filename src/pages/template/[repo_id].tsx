import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Template.module.scss';
import Image from 'next/image';
import Router from 'next/router';
import { TextField, FormControl, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';
import { forceLogout } from '../../components/auth/auth';
import { getCategoryWithTemplate } from '../../service/category.service';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},

	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '100%',
	},
}));

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let templates = [];
	let category = null;
	let collections = [];
	let repoId = null;

	try {
		repoId = context.params.repo_id;
		cookie = context?.req?.headers.cookie;

		//fetch all active template group
		let result = await axios.get(`${process.env.API_URL}/template-collection`, {
			headers: {
				cookie: cookie!,
			},
		});
		collections = result.data;

		//fetch templates
		let result2 = await axios.get(`${process.env.API_URL}/template-collection/getById/${collections[0].id}`, {
			headers: {
				cookie: cookie!,
			},
		});
		console.log('object>>>>>>>' + JSON.stringify(result2.data));
		templates = result2.data.template_collection.map((t) => {
			return t.template;
		});
	} catch (error) {
		console.log(`error in template ${error}`);
		isError = true;
	}

	return {
		props: { isError, collections, templates, repoId },
	};
};

const ListTemplate = ({ isError, collections, templates, repoId }) => {
	console.log('test repo id', repoId);

	const [tempArr, setTempArr] = useState(templates);
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	const handleChange = async (searchKey) => {
		let result = await axios.get(`/api/template/search/${searchKey}`);
		setTempArr(result.data);
	};

	const handleTemplate = async (temp_id) => {
		console.log('handle template method call --->', temp_id);
		Router.push(`/template/preview/${repoId}/${temp_id}`);
	};

	const reloadTemplate = async (id) => {
		let result = await axios.get(`/api/template-collection/getById/${id}`);
		let templates = result.data.template_collection.map((t) => {
			return t.template;
		});
		setTempArr(templates);
	};

	const classes = useStyles();

	return (
		<>
			<div className={styles.temp_wrap}>
				<div className={styles.left}>
					<div style={{ padding: '20px' }}>Lead Capture - Template gallery </div>
					<div style={{ marginTop: '5px' }}>
						<Divider />
					</div>
					<div style={{ padding: '20px' }}>Use templates to quickly get started. Modern SEO ready templates for better conversion.</div>
					<div style={{ marginTop: '5px' }}>
						<Divider />
					</div>
					<div className={styles.body}>
						{collections.map((temp, index) => {
							return (
								<div key={index} className={styles.temp_group_list}>
									<div className={styles.name} onClick={(event) => reloadTemplate(temp.id)}>
										{temp.name}
									</div>
									<div className={styles.count}>{temp.template_collection.length}</div>
								</div>
							);
						})}
					</div>
					<div style={{ marginTop: '5px' }}>
						<Divider />
					</div>
				</div>

				<div className={styles.right}>
					<div className={styles.dialog_pop} style={{ marginTop: '40px' }}>
						<div style={{ fontSize: '20px' }}>&emsp;</div>
						<div style={{ cursor: 'pointer', marginRight: '10px' }} onClick={(event) => Router.back()}>
							Back
						</div>
					</div>

					<div className={styles.search}>
						<FormControl fullWidth className={clsx(classes.textField)}>
							<Input
								type='text'
								placeholder='Search for a template'
								fullWidth
								margin='dense'
								name='search'
								onChange={(event) => {
									handleChange(event.target.value);
								}}
								startAdornment={
									<InputAdornment position='start'>
										<IconButton aria-label='toggle password visibility'>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</div>

					<div className={styles.title}>
						<div>Lead capture</div>
						<div style={{ marginTop: '5px' }}>
							<Divider />
						</div>
					</div>

					<div className={styles.body} style={{ padding: '1rem 4rem' }}>
						{tempArr.map((temp, index) => {
							return (
								<div key={index} className={styles.list_temp} onClick={() => handleTemplate(temp.template_id)}>
									<div className={styles.temp_image}></div>
									<div className={styles.temp_title}>{temp.template_name}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default ListTemplate;
