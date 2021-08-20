import { useState } from 'react';
import Router from 'next/router';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import styles from '../../styles/Home.module.scss';
import Link from 'next/link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { da } from 'date-fns/locale';

const SignupComponent = () => {
	const [isError, setIsError] = useState(false);
	const [ErMessage, setErMessage] = useState('');
	let schema = yup.object().shape({
		name: yup.string().required(),
		companyName:yup.string().required(),
		email: yup.string().email().required(),
		password: yup.string().required().min(8).max(16),
	});

	//error style
	let errorStyle = {
		color: 'red',
		content: '⚠ ',
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const [showPassword, setShowPassword] = useState(false);

	const onSubmit = async (data) => {
		const body = {
			name: data.name,
			password: data.password,
			email: data.email,
			companyName:data.companyName,
			origin: 'lapa',
		};
		 
		axios.post(`/api/auth/signup`, body).then((response) => {
			if (!response.data.status) {
				showTest(true, response.data.error);
			} else {
				console.log("test signup response",response)
				 Router.push(`/dashboard`);
				// Router.push(`/`);
			}
		});
	};

	const showTest = (flag, data) => {
		setErMessage(data);
		setIsError(flag);
		setTimeout(() => {
			setIsError(false);
		}, 3000);
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const signupForm = () => {
		return (
			<>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.login_flex_container}>
						<div className={styles.login_caps}>
							<div className='academy__name'>Drafty Content Solutions</div>
						</div>

						<TextField type='text' label='Enter User Name *' fullWidth margin='dense' name='name' autoComplete='off' {...register('name')} />
						<p style={errorStyle}>{errors.name?.message}</p>

						<TextField type='text' label='Enter Company Name *' fullWidth margin='dense' name='companyName' autoComplete='off' {...register('companyName')} />
						<p style={errorStyle}>{errors.companyName?.message}</p>

						<TextField type='email' label='Enter Email *' fullWidth margin='dense' name='email' autoComplete='off' {...register('email')} />
						<p style={errorStyle}>{errors.email?.message}</p>
						{isError && <p style={errorStyle}>{ErMessage}</p>}
						<FormControl fullWidth>
							<InputLabel htmlFor='standard-adornment-password'>Password *</InputLabel>
							<Input
								id='standard-adornment-password'
								type={showPassword ? 'text' : 'password'}
								name='password'
								fullWidth
								autoComplete='off'
								margin='dense'
								{...register('password')}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								}
							/>
							<p style={errorStyle}>{errors.password?.message}</p>
						</FormControl>

						<div className={styles.styl_center}>
							<Button type='submit' variant='contained' color='primary'>
								Sign Up
							</Button>
						</div>

						<div>
							Already a member?{' '}
							<Link href='/'>
								<a>Signin</a>
							</Link>
						</div>
					</div>
				</form>
			</>
		);
	};

	return <>{signupForm()}</>;
};

export default SignupComponent;
