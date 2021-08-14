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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const ForgotPassword = () => {
	const [isError, setIsError] = useState(false);
    const [ErMessage, setErMessage] = useState('');
    const [snack, setSnack] = useState(false);
    const [alertStatus, setAlertStatus] = useState("success");
    const [message, setMessage] = useState('');


    
    
	let schema = yup.object().shape({
        email: yup.string().email().required(),
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
        link:'',
		error: '',
		loading: false,
		message: '',
		showForm: true,
	});
	const showLoading = () => (loading ? <div className='alert alert-info'>Loading...</div> : '');
    
    const { error, loading, showForm } = values;
        const handleSnackOpen = (data,status) => {
            setMessage(data);
            if(status) setAlertStatus("error")
            else setAlertStatus("success")
            setSnack(true);
        };

	const onSubmit =async (data) => {
        
        setValues({ ...values, loading: true, error: false });
		const body = {
			email: data.email,
		
		  };
	
			axios.post(`/api/auth/forgot-password`, body).then( (response)=> {
                debugger
                if (response.status === 200 && response.data.isError) {
                    showError(true, response.data.message);
                    handleSnackOpen("User Not Found",true);
                    setValues({ ...values, loading: false });
                } else{
                    console.log("reset link---->",response.data.link)
                    setValues({ ...values, loading: false ,link:response.data.link});
                     handleSnackOpen("Reset Link send successfully",false);
                    //   Router.push(`/`);
            }
		});
	};

	const showError = (flag, data) => {
		setErMessage(data);
		setIsError(flag);
		setTimeout(() => {
			setIsError(false);
		}, 3000);
	};


	const ForgotForm = () => {
		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.login_flex_container}>
                <div className={styles.login_caps}>
						<div className='academy__name'>
							<h3>Forgot password</h3>
						</div>
					</div>
					<TextField
						type='text'
						label='Enter Email *'
						fullWidth
						margin='dense'
						name='email'
						autoComplete='off'
						{...register('email')}
					/>
					<p style={errorStyle}>{errors.email?.message}</p>
				
					<div className={styles.styl_center}>
						<Button type='submit' variant='contained' color='primary' style={{marginRight:'10px'}}>
						     Reset
						</Button>
                        
                        <Link href='/' >
                        <Button  variant='contained' color='primary' style={{marginLeft:'10px'}}>
							cancel
						</Button>
                        </Link>

						{isError && <p style={errorStyle}>{ErMessage}</p>}
					</div>
				
					
				</div>
			</form>
		);
	};

	return (
		<>
        <div>
        {showLoading()}
			{ ForgotForm()}
            <div>
            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled' severity={alertStatus}>
					{message}
				</MuiAlert>
			</Snackbar>
            </div>
            </div>
		</>
	);
};

export default ForgotPassword;
