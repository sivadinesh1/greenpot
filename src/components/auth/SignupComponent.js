import { useState } from 'react';
import Router from 'next/router';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

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
import Checkbox from '@material-ui/core/Checkbox';
import Image from 'next/image';
import clsx from 'clsx';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
	},

	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: '100%',
	},
}));

const SignupComponent = () => {
	const classes = useStyles();
	const [isEmailTaken, setIsEmailTaken] = useState(false);
	const [isError, setIsError] = useState(false);
	const [ErMessage, setErMessage] = useState('');
	let schema = yup.object().shape({
		name: yup.string().required(),

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
		setIsEmailTaken(false);
		const body = {
			name: data.name,
			password: data.password,
			email: data.email,
			origin: 'lapa',
		};

		axios.post(`/api/auth/signup`, body).then((response) => {
			if (!response.data.status) {
				if (response.data.error === 'email taken') {
					setIsEmailTaken(true);
				}
			} else {
				localStorage.setItem('islogged', true);

				Router.push(`/dashboard`);
				state.islogged = true;
				state.user = response.data.user;
			}
		});
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
						<div>
							<Image src='/static/images/webb.svg' alt='edit' width='180px' height='108px' />
						</div>
						<div>
							<h2 className={styles.login_caps}>
								<span style={{ borderBottom: '1px solid #bebebe', paddingBottom: '16px' }}>Create Your # Webb Account</span>
							</h2>
							<div style={{ paddingTop: '16px', paddingBottom: '16px', fontSize: '14px' }}>
								<span style={{ color: 'grey' }}>Already have an account? </span>&nbsp;
								<Link href='/'>
									<a>
										<span className={styles.login_links}>Log In</span>
									</a>
								</Link>
							</div>

							{isEmailTaken ? <div className={styles.login_error_summary}>Sorry, this email is already taken.</div> : ''}

							<TextField
								type='text'
								label='Enter Email'
								fullWidth
								margin='dense'
								name='email'
								autoComplete='off'
								{...register('email')}
								error={!!errors.email}
								helperText={errors?.email?.message}
							/>

							<TextField
								type='text'
								label='Enter Name'
								fullWidth
								margin='dense'
								name='name'
								autoComplete='off'
								{...register('name')}
								error={!!errors.name}
								helperText={errors?.name?.message}
							/>

							<FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
								<InputLabel htmlFor='standard-adornment-password'>Enter Password</InputLabel>
								<Input
									id='standard-adornment-password'
									type={showPassword ? 'text' : 'password'}
									name='password'
									label='Enter Password'
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
									error={!!errors.password}
								/>
								<div className='global_errors'>{errors && errors?.password?.message}</div>
							</FormControl>

							<div className={styles.styl_center}>
								<Button
									type='submit'
									variant='contained'
									color='primary'
									fullWidth
									style={{
										textTransform: 'capitalize',
										backgroundColor: '#1a34f8',
										padding: '6px 36px',
										fontSize: '18px',
									}}>
									Sign Up with Email
								</Button>

								{isError && <p style={errorStyle}>{ErMessage}</p>}
							</div>
							<div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>or</div>
							<div className={styles.styl_center}>
								<Link href='/api/glogin'>
									<Button
										type='button'
										variant='outlined'
										color='primary'
										fullWidth
										style={{
											textTransform: 'capitalize',

											padding: '6px 36px',
											fontSize: '16px',
										}}>
										<Image src='/static/images/google-icon.svg' alt='edit' width='20px' height='20px' />
										&nbsp;&nbsp;Signup with Google
									</Button>
								</Link>
								{isError && <p style={errorStyle}>{ErMessage}</p>}
							</div>

							<div className={styles.fgt_pass}>
								<div className={styles.tnc}>
									<Checkbox
										color='primary'
										style={{
											color: '#317C89',
										}}
									/>{' '}
									I agree to # Webbs Terms of Service and Privacy Policy
								</div>
							</div>
						</div>
						<div style={{ fontSize: '11px', color: '#241c15a6', paddingTop: '32px', paddingBottom: '10px' }}>
							©2021 All Rights Reserved. # Webb is a registered trademark of Squapl Digital Media Technologies. Cookie Preferences, Privacy, and
							Terms.
						</div>
					</div>
				</form>
			</>
		);
	};

	return <>{signupForm()}</>;
};

export default SignupComponent;
