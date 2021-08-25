import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from '../../../../styles/company.module.scss';
import { parseCookies } from '../../../api/auth/user';
import axios from 'axios';
import useSWR from 'swr';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { InputLabel, Select,MenuItem  } from "@material-ui/core";
import ReactHookFormSelect from '../../../../components/ReactHookFormSelect'



const ColorButton = withStyles(() => ({
    root: {
        color: '#fff',
        backgroundColor: '#0000FF',
        '&:hover': {
            backgroundColor: '#f0f0ff',
        },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: "100%"
      },
    buttonProps: {
        fontSize: '1rem',
        borderRadius: '5em',
        padding: '8px 50px',
        textTransform: 'capitalize',
    },
}));

export const getServerSideProps = async (context) => {
    let { user_id, company_id } = await parseCookies(context?.req);
    if (user_id === undefined || company_id === undefined) {
        return {
            redirect: { destination: '/', permanent: false },
        };
    }

    return {
        props: { company_id },
    };
};

export default function Index({company_id}) {
    const [snack, setSnack] = useState(false);
    const [message, setMessage] = useState('');

    let schema = yup.object().shape({
        name: yup.string().required().min(3).max(60),
        email: yup.string().required(),
        role:yup.string().notRequired()
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'onTouched',
        resolver: yupResolver(schema)
    });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<Array<string>>([]);
    const [error, setError] = useState(false);

    const handleSnackOpen = (message) => {
        setSnack(true);
        setMessage(message);
    };


    const onSubmit = async (formData, event) => {
        console.log("test form data--->",formData)
        if (submitting) {
			return false;
		}

		const subUser = {
			name: formData.name,
			email: formData.email,
            companyId:company_id,
            accessRights:formData.role
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		axios.post(`/api/author`, subUser).then(function (response) {
			if (response.data.errors) {
				setServerErrors(response.data.errors);
				setError(true);
			}

			setSubmitting(false);
			if (response.status === 201) {
				handleSnackOpen('Sub User Successfully Created');
			}
		});    
    }
    const classes = useStyles();


    return (
        <>
            <div className={styles.com_wrap}>
                <div className={styles.left}>

                </div>

                <div className={styles.right}>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px' }}>
                            <div
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                }}>
                                {' '}
                                Author
				            </div>
                            <div style={{ fontSize: '1.3rem', padding: '1rem' }}>
                                <Button onClick={() => Router.back()} type='button' variant='contained' color='primary'>
                                    Back
					            </Button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles.formGap}>
                                    <Controller
                                        name='name'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                type='text'
                                                label='Name'
                                                margin='dense'
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                                error={!!errors.name}
                                                helperText={errors?.name?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                <div className={styles.formGap}>
                                    <Controller
                                        name='email'
                                        control={control}
                                         rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                type='email'
                                                label='Email'
                                                margin='dense'
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                                error={!!errors.email}
                                                helperText={errors?.email?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                <div className={styles.formGap}>
                                 <ReactHookFormSelect
                                        id="role"
                                        name="role"
                                        label="Role"
                                        className={classes.textField}
                                        control={control}
                                         defaultValue={"W"}
                                        >
                                             <MenuItem  value="">Select role...</MenuItem>
                                                 <MenuItem  value="A">Author Only</MenuItem>
                                                <MenuItem  value="P">Author/Publish</MenuItem>
                                                <MenuItem  value="W">Write Only</MenuItem>
                                    </ReactHookFormSelect>
                                 </div>
                              
                                <div className={styles.textCenter}>
                                    <ColorButton variant='contained' color='primary' className={classes.buttonProps} type='submit'>
                                        submit
					                </ColorButton>
                                </div>
                            </form>
                    </div>

                </div>
            </div>

            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
                <MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
                    {message}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
