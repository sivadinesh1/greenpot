import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import styles from '../../../styles/Category.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { mutate } from 'swr';
import { FormInputText } from '../../forms/FormInputText';


interface IFormData {
	name: string;
}




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

const EditCategory = ({ editItem, onMode, onReloadCategoryList, handleSnackOpen, chooseMode, company_id }) => {
	const preloadedValues = {
		name: '',
	};

	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(60),
	});

	const form = useForm<IFormData>({
		defaultValues: preloadedValues,
		mode: 'onTouched',
		resolver: yupResolver(schema),
	});

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	const {
		setValue,
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = form;

	useEffect(() => {
		if (onMode === 'edit') {
			setValue('name', editItem.name);
		}
	}, [onMode, editItem]);

	const onSubmit = async (formData: IFormData) => {
		if (onMode === 'edit') {
			editCategory(formData);
		} else {
			addCategory(formData);
		}
	};

	const editCategory = (formData) => {
		if (submitting) {
			return false;
		}

		const category = {
			name: formData.name,
			categoryid: editItem.id,
			company_id: editItem.company_id,
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		axios.put(`/api/category`, category).then(function (response) {
			if (response.data.errors) {
				setServerErrors(response.data.errors);
				setError(true);
			}

			setSubmitting(false);
			if (response.status === 200 && response.data.result === 'success') {
				onReloadCategoryList();
				handleSnackOpen('Category Successfully Updated');
				chooseMode('add');
				reset({ name: '' });
			}
		});
	};

	const addCategory = async (formData) => {
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
			reset({ name: '' });
			chooseMode('add');
		}
	};

	const classes = useStyles();

	return (
		<div>
			<div className={styles.title}>{onMode === 'edit' ? 'Edit Category' : 'Add Category'}</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.formGap}>
					<FormInputText name='name' control={control} label='Enter Category Name' />

				</div>
				<div className={styles.textCenter}>
					<Button variant='contained' color='primary' type='submit'>
						{onMode === 'edit' ? 'Update' : 'Create'}
					</Button>
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

export default EditCategory;
