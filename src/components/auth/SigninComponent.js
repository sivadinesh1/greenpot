import { useState, useEffect } from 'react';

import { authenticate, isAuth } from './auth';
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

// const loadData = async (locale) => {
// 	const response = await fetch("/api/hello", {
// 		headers: { "Accept-Language": locale },
// 	});
// 	const data = await response.json();
// 	return data;
// };

const SigninComponent = () => {
	//const { data } = useSWR([locale, "hello"], loadData);
	const { formatMessage: f } = useIntl();

	const [showPassword, setShowPassword] = useState(false);

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

	const { email, password, error, loading, message, showForm } = values;

	useEffect(() => {
		isAuth();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		// console.table({ name, email, password, error, loading, message, showForm });
		setValues({ ...values, loading: true, error: false });
		const user = { email, password };

		axios.post(`/api/auth/signin`, user).then(function (response) {
			if (response.data.error) {
				setValues({ ...values, error: data.error, loading: false });
			} else {
				authenticate(response.data, () => {
					Router.push(`/`);
				});

				authenticate(response.data, () => {
					if (isAuth() && isAuth().role === '1') {
						Router.push(`/admin`);
					} else {
						Router.push(`/user`);
					}
				});
			}
		});

		// signin(user).then(res => {
		// 	console.log("test data check--->",res)
		//     if (res.data.error) {
		//         setValues({ ...values, error: data.error, loading: false });
		//     } else {
		//         // save user token to cookie
		//         // save user info to localstorage
		//         // authenticate user
		//         authenticate(res.data, () => {
		//             Router.push(`/`);
		//         });

		//         authenticate(res.data, () => {
		//             if (isAuth() && isAuth().role === "1") {
		//                 Router.push(`/admin`);
		//             } else {
		//                 Router.push(`/user`);
		//             }
		//         });

		//     }
		// });
	};

	const handleChange = (name) => (e) => {
		setValues({ ...values, error: false, [name]: e.target.value });
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
			<form onSubmit={handleSubmit}>
				<div className={styles.login_flex_container}>
					<div className={styles.login_caps}>
						{/* logo to be here */}
						{/* <img
								src={hallacademylogo}
								alt='hallmark academy logo'
								className='imgstyle'
							/> */}
						<div className='academy__name'>
							<h4>{f({ id: 'APP_NAME' })}</h4>
						</div>
					</div>

					<TextField type='text' label='Enter Email' fullWidth margin='dense' name='email' value={email} onChange={handleChange('email')} />

					<FormControl fullWidth>
						<InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
						<Input
							id='standard-adornment-password'
							type={showPassword ? 'text' : 'password'}
							name='password'
							fullWidth
							margin='dense'
							value={password}
							onChange={handleChange('password')}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
						/>
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
					</div>
					<div>
						{f({ id: 'NOT_A_MEMBER' })}{' '}
						<Link href='/signup'>
							<a>Signup</a>
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
