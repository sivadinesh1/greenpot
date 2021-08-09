import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';

import { withStyles, makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import styles from '../../../styles/Tag.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';

import axios from 'axios';
import { mutate, trigger } from 'swr';

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

export default function AddTag({ tags, onReloadTagList, handleSnackOpen, company_id }) {
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
			companyid: company_id,
		};
		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/tag/crud`, values);

		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		setSubmitting(false);

		if (response.status === 201) {
			onReloadTagList();
			handleSnackOpen('Tag Successfully Added');
			event.target.reset();
		}
	};

	const classes = useStyles();

	return (
		<div>
			<div className={styles.title}>ADD TAG</div>
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
					/>
					{errors.name && <span className='white-error'>{errors.name.message}</span>}
				</div>
				<div className={styles.textCenter}>
					<ColorButton variant='contained' color='primary' disabled={submitting} className={classes.buttonProps} type='submit'>
						Add Tag
					</ColorButton>
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
}
