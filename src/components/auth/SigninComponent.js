import { useState, useEffect } from 'react';
import { authenticate, isAuth } from '../../components/auth/auth';
import Router from 'next/router';
import styles from '../../styles/Home.module.scss';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const SigninComponent = () => {
	const { formatMessage: f } = useIntl();
	const [isError, setIsError] = useState(false);
	const [ErMessage, setErMessage] = useState('');

	const [showPassword, setShowPassword] = useState(false);
	let schema = yup.object().shape({
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

	const [values, setValues] = useState({
		email: '',
		password: '',
		// email: 'din@gmail.com',
		// password: 'password',
		error: '',
		loading: false,
		message: '',
		showForm: true,
	});

	const { error, loading, message, showForm } = values;

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);
	const onSubmit = (data) => {
		setValues({ ...values, loading: true, error: false });
		axios.post(`/api/auth/signin`, data).then(function (response) {
			if (response.data.error) {
				setValues({ ...values, error: data.error, loading: false });
			} else if (response.data.errorCode === 1) {
				setValues({ ...values, loading: false });
				showTest(true, response.data.message);
			} else {
				authenticate(response.data, () => {
					if (isAuth() && isAuth().role === '1') {
						Router.push(`/admin`);
					} else {
						Router.push(`/user`);
					}
				});
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

	const showLoading = () => (loading ? <div className='alert alert-info'>Loading...</div> : '');
	const showError = () => (error ? <div className='alert alert-danger'>{error}</div> : '');
	const showMessage = () => (message ? <div className='alert alert-info'>{message}</div> : '');

	const signinForm = () => {
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.login_flex_container}>
					<div className={styles.login_caps}>
						<div className='academy__name'>
							<h4>{f({ id: 'APP_NAME' })}</h4>
						</div>
					</div>

					<TextField
						type='text'
						label='Enter Email'
						fullWidth
						margin='dense'
						name='email'
						// value={email}
						// onChange={handleChange('email')}
						{...register('email')}
					/>
					<p style={errorStyle}>{errors.email?.message}</p>

					<FormControl fullWidth>
						<InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
						<Input
							id='standard-adornment-password'
							type={showPassword ? 'text' : 'password'}
							name='password'
							fullWidth
							margin='dense'
							// value={password}
							// onChange={handleChange('password')}
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

					<div className={styles.fgt_pass}>
						<div className={styles.login_rememberme}>&nbsp;</div>
						<div className={styles.login_forgotpass}>
							<Link href='/signup'>
								<a>Forgot Password</a>
							</Link>
						</div>
					</div>

					<div className={styles.styl_center}>
						<Button type='submit' variant='contained' color='primary'>
							Sign In
						</Button>

						{isError && <p style={errorStyle}>{ErMessage}</p>}
					</div>
					<div>
						{f({ id: 'NOT_A_MEMBER' })}{' '}
						<Link href='/signup'>
							<a>Signup</a>
						</Link>
					</div>
					<div>
						<Link href='/api/glogin'>
							<a>Click me to log in using Google</a>
						</Link>
					</div>
				</div>
			</form>
		);
	};

	return (
		<>
			{showError()}
			{showLoading()}
			{showMessage()}
			{showForm && signinForm()}
		</>
	);
};

export default SigninComponent;
