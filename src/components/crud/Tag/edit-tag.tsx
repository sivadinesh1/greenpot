import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from '../../../styles/Tag.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { mutate } from 'swr';

interface FormData {
	name: string;
}

const ColorButton = withStyles(() => ({
	root: {
		color: '#000',
		backgroundColor: '#fff',
		'&:hover': {
			backgroundColor: '#f0f0ff',
		},
	},
}))(Button);

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
	TextFieldProps: {
		color: '#fff',
		borderBottom: '1px solid #fff',
	},
	buttonProps: {
		fontSize: '1rem',
		borderRadius: '5em',
		padding: '8px 50px',
		textTransform: 'capitalize',
	},
}));

const EditTag = ({ editItem, onMode, onReloadTagList, handleSnackOpen }) => {
	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(60),
	});

	const form = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = form;

	const onSubmit = (formData, event) => {
		if (submitting) {
			return false;
		}

		const tag = {
			name: formData.name,
			tagid: editItem.id,
			companyid: editItem.companyid,
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);
		mutate(`/api/tag/crud/company/${editItem.id}`);
		axios.put(`/api/tag/crud`, tag).then(function (response) {
			if (response.data.errors) {
				setServerErrors(response.data.errors);
				setError(true);
			}

			setSubmitting(false);
			if (response.status === 200 && response.data.result === 'success') {
				onReloadTagList();
				handleMode();
				handleSnackOpen('Tag Successfully Updated');
				event.target.reset();
			}
		});
	};

	const classes = useStyles();

	const handleMode = () => {
		onMode('add');
	};

	return (
		<div>
			<div className={styles.title}>EDIT TAG</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.formGap}>
					<TextField
						type='text'
						label='Tag Name'
						margin='dense'
						name='name'
						variant='standard'
						size='small'
						fullWidth
						InputProps={{
							className: classes.TextFieldProps,
						}}
						InputLabelProps={{
							style: { color: '#fff' },
						}}
						style={{ borderRadius: '50px' }}
						{...register('name')}
						defaultValue={editItem.name}
					/>
					{errors.name && <span className='white-error'>{errors.name.message}</span>}
				</div>
				<div className={styles.textCenter}>
					<ColorButton variant='contained' color='primary' className={classes.buttonProps} type='submit'>
						Edit Tag
					</ColorButton>
				</div>
				<div className={styles.backToAdd} onClick={() => handleMode()}>
					<Image src='/static/images/back.svg' alt='back' width='20px' height='20px' />

					<span>Back to Add Tag</span>
				</div>
			</form>
			{serverErrors && (
				<div className='error-table'>
					{error && <div className='white-error tbl-header-font'>Please correct below errors. </div>}

					<ul>
						{serverErrors.map((error) => (
							<li key={error} className='white-error'>
								<span className='white-error'>{error}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default EditTag;
