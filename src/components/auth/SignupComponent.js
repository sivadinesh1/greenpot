import { useState, useEffect } from 'react';
import { signup, isAuth } from '../auth';
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

const SignupComponent = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [values, setValues] = useState({
		name: '',
		email: '',
		password: '',
		error: '',
		loading: false,
		message: '',
		showForm: true,
	});

	const { name, email, password } = values;

	const handleSubmit = (e) => {
		e.preventDefault();
		//console.table({ name, email, password, error, loading, message, showForm });

		setValues({ ...values, loading: true, error: false });
		const user = { name, email, password };

		signup(user).then((res) => {
			if (res.data.error) {
				setValues({ ...values, error: res.data.error, loading: false });
			} else {
				setValues({
					...values,
					name: '',
					email: '',
					password: '',
					error: '',
					loading: false,
					message: res.data.message,
					showForm: false,
				});
			}
		});
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

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const signupForm = () => {
		return (
			<>
				<form onSubmit={handleSubmit}>
					<div className={styles.login_flex_container}>
						<div className={styles.login_caps}>
							{/* logo to be here */}
							{/* <img
								src={hallacademylogo}
								alt='hallmark academy logo'
								className='imgstyle'
							/> */}
							<div className='academy__name'>Drafty Content Solutions</div>
						</div>

						<TextField type='text' label='Enter Name' fullWidth margin='dense' name='name' value={name} onChange={handleChange('name')} />

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
								Sign Up
							</Button>
						</div>

						{/* <div> */}
						{/* <button className="btn btn-primary">Signup</button> */}

						{/* <Button variant='contained' color='primary'>
								Primary
							</Button> */}
						{/* </div> */}
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
