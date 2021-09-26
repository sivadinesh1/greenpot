import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
// import styles from '../../../styles/Category.module.scss';
import styles from '../../../styles/Category.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';

import axios from 'axios';
import { mutate, trigger } from 'swr';

interface FormData {
	name: string;
}

// const ColorButton = withStyles(() => ({
// 	root: {
// 		color: '#000',
// 		backgroundColor: '#fff',
// 		'&:hover': {
// 			backgroundColor: '#f0f0ff',
// 		},
// 	},
// }))(Button);

export default function AddCategory({ categories, onReloadCategoryList, handleSnackOpen, company_id }) {
	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(60),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	const onSubmit = async (formData, event) => {
		if (submitting) {
			return false;
		}
		const values = {
			name: formData.name,
			company_id: company_id,
		};
		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/category`, values);

		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		setSubmitting(false);

		if (response.status === 201) {
			onReloadCategoryList();
			handleSnackOpen('Category Successfully Added');
			event.target.reset();
		}
	};

	return (
		<div>
			<div className={styles.title}>ADD CATEGORY</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.formGap}>
					<TextField
						type='text'
						label='Company Name'
						margin='dense'
						name='name'
						variant='standard'
						size='small'
						fullWidth
						style={{ borderRadius: '50px' }}
						{...register('name')}
					/>
					{errors.name && <span className='errors'>{errors.name.message}</span>}
				</div>
				<div className={styles.textCenter}>
					<Button variant='contained' color='primary' disabled={submitting} type='submit'>
						Add Category
					</Button>
				</div>
			</form>
			{serverErrors && (
				<div className='error-table'>
					{error && <div className='error tbl-header-font'>Please correct below errors. </div>}

					<ul>
						{serverErrors.map((error) => (
							<li key={error} className='error-summary'>
								<span className='error'>{error}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
