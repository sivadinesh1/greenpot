import React, { useState, useEffect } from 'react';

import { useForm, Controller, FieldErrors } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import axios from 'axios';

import styles from '../../../styles/Tag.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';

import { FormInputText } from '../../forms/FormInputText';

interface IFormData {
	name: string;
}

const EditTag = ({ editItem, onMode, chooseMode, onReloadTagList, handleSnackOpen, company_id }) => {
	let preloadedValues = {
		name: '',
	};

	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(60),
	});

	const form = useForm<IFormData>({ defaultValues: preloadedValues, mode: 'onTouched', resolver: yupResolver(schema) });
	const {
		setValue,
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = form;

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (onMode === 'edit') {
			setValue('name', editItem.name);
		}
	}, [onMode, editItem]);

	const onSubmit = async (formData: IFormData) => {
		if (onMode === 'edit') {
			editTagSubmit(formData);
		} else {
			addTagSubmit(formData);
		}
	};

	const editTagSubmit = (formData: IFormData) => {
		if (submitting) {
			return false;
		}

		const tag = {
			name: formData.name,
			tag_id: editItem.id,
			company_id: editItem.company_id,
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		axios.put(`/api/tag`, tag).then(function (response) {
			if (response.data.errors) {
				setServerErrors(response.data.errors);
				setError(true);
			}

			setSubmitting(false);
			if (response.status === 200 && response.data.result === 'success') {
				onReloadTagList();

				handleSnackOpen('Tag Successfully Updated');

				reset({ name: '' });
				chooseMode('add');
			}
		});
	};

	const addTagSubmit = async (formData: IFormData) => {
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

		const response = await axios.post(`/api/tag`, values);

		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		setSubmitting(false);

		if (response.status === 201) {
			onReloadTagList();
			handleSnackOpen('Tag Successfully Added');

			reset({ name: '' });
			chooseMode('add');
		}
	};

	return (
		<div>
			<div className={styles.title}>{onMode === 'edit' ? 'Edit Tag' : 'Add Tag'}</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.formGap}>
					<FormInputText name='name' control={control} label='Enter Tag Name' />
				</div>
				{serverErrors && (
					<>
						{serverErrors.map((error) => (
							<div key={error} className='error'>
								<span className='error'>{error}</span>
							</div>
						))}
					</>
				)}
				<div className={styles.textCenter}>
					<Button variant='contained' color='primary' type='submit'>
						{onMode === 'edit' ? 'Update' : 'Create'}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default EditTag;
