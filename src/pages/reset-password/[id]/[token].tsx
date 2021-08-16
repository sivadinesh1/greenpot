import { TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';
import { getUserById } from '../../api/auth/common';
import axios from 'axios';
import Router from 'next/router';

const jwt = require('jsonwebtoken');

export const getServerSideProps = async (context) => {
	const { id, token } = context.params;
	const user = await getUserById(id);
	var response = null;
	if (user == null) {
		response = 'User Not Found';
	} else {
		try {
			const secret = process.env.JWT_SECRET;
			const user = jwt.verify(token, secret);
			response = user;
		} catch (error) {}
	}

	return {
		props: { user: response },
	};
};

const Token = ({ user }) => {
	const { register, handleSubmit } = useForm();
	const onSubmit = async (data) => {
		const values = {
			id: user.id,
			password: data.password,
			salt: user.salt,
		};
		const response = await axios.post(`/api/auth/reset-password`, values);
		if (response.status === 200 && response.data.message === 'success') {
			Router.push(`/`);
		}
	};
	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<br />
					<br />
					<br />
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField type='text' label='New password' fullWidth margin='dense' name='password' autoComplete='off' {...register('password')} />
						<TextField type='text' label='Confirm Password' fullWidth margin='dense' name='password' autoComplete='off' {...register('password1')} />
						<Button type='submit' variant='contained' color='primary'>
							Change
						</Button>
					</form>
				</div>
			</div>
		</>
	);
};

export default Token;
