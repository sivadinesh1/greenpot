import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { getUserByNano } from '../../../service/auth/auth.service';
import axios from 'axios';
import Router from 'next/router';
import styles from '../../..//styles/Home.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const jwt = require('jsonwebtoken');

export const getServerSideProps = async (context) => {
	const { user_id, token } = context.params;
	const user = await getUserByNano(user_id);
	var response = null;
	if (user == null) {
		response = 'User Not Found';
	} else {
		try {
			const secret = process.env.ACCESS_TOKEN_SECRET;
			const user = jwt.verify(token, secret);
			response = user;
		} catch (error) {}
	}

	return {
		props: { user: response },
	};
};

const Token = ({ user }) => {
	let schema = yup.object().shape({
		password: yup.string().required().min(8).max(16),
		confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Password miss match'),
	});

	let errorStyle = {
		color: 'red',
		content: '⚠ ',
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const onSubmit = async (data) => {
		const values = {
			id: user.id,
			password: data.password,
		};
		const response = await axios.post(`/api/author/signup`, values);
		if (response.status === 200 && response.data.message === 'success') {
			Router.push(`/dashboard`);
		}
	};
	return (
		<>
			<div>
				<div className={styles.author_signup_flex_container}>
					<br />
					<br />
					<br />
					<div className={styles.login_caps}>
						<div className='academy__name'>Author Signup</div>
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField type='text' label='New password' fullWidth margin='dense' name='password' autoComplete='off' {...register('password')} />
						<p style={errorStyle}>{errors.password?.message}</p>
						<FormControl fullWidth>
							<InputLabel htmlFor='standard-adornment-password'>Confirm Password *</InputLabel>
							<Input
								id='standard-adornment-password'
								type={showPassword ? 'text' : 'password'}
								name='confirmPassword'
								fullWidth
								autoComplete='off'
								margin='dense'
								{...register('confirmPassword')}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							<p style={errorStyle}>{errors.confirmPassword?.message}</p>
						</FormControl>
						<div className={styles.styl_center}>
							<Button type='submit' variant='contained' color='primary'>
								Submit
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Token;
