import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from '../../../../styles/Category.module.scss'
import { parseCookies } from '../../../api/auth/user';
import axios from 'axios';
import { Button } from '@material-ui/core';
import useSWR from 'swr';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';



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


const ColorButton = withStyles(() => ({
    root: {
        color: '#000',
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: '#f0f0ff',
        },
    },
}))(Button);

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    TextFieldProps: {
        color: '#000000',
        borderBottom: '1px solid #fff',
    },
    buttonProps: {
        fontSize: '1rem',
        borderRadius: '5em',
        padding: '8px 50px',
        textTransform: 'capitalize',
    },
}));

export default function Index({ company_id }) {
    const [snack, setSnack] = useState(false);
    const [message, setMessage] = useState('');
    //let categorysList: Category[] = data;

    let schema = yup.object().shape({
        name: yup.string().required().min(3).max(60),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<Array<string>>([]);
    const [error, setError] = useState(false);

    const handleSnackOpen = (message) => {
        setSnack(true);
        setMessage(message);
    };

    const onSubmit = async (formData, event) => {
        if (submitting) {
            return false;
        }
        const values = {
            name: formData.name,
            companyId: company_id,
            status: "A"
        };
        setSubmitting(true);
        setServerErrors([]);
        setError(false);

        const response = await axios.post(`/api/repository`, values);

        if (response.data.errors) {
            setServerErrors(response.data.errors);
            setError(true);
        }

        setSubmitting(false);

        if (response.status === 201) {
            Router.push("/dashboard")
            handleSnackOpen('Repository Successfully Added');
            event.target.reset();
        }
    }
    const classes = useStyles();

    return (
        <>
            <div className={styles.cat_wrap}>
                <div className={styles.left}>

                </div>

                <div className={styles.right}>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 10px', padding: '1rem' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                            }}> Add Repository</div>
                            <div style={{ fontSize: '1.3rem', marginRight: '10px' }}>
                                <Button onClick={() => Router.back()} type='button' variant='contained' color='primary'>
                                    Back
					</Button>
                            </div>
                        </div>
                        <div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles.formGap}>
                                    <TextField
                                        type='text'
                                        label='Repo Name'
                                        margin='dense'
                                        name='name'
                                        variant='standard'
                                        size='small'
                                        fullWidth
                                        InputProps={{
                                            className: classes.TextFieldProps,
                                        }}
                                        InputLabelProps={{
                                            style: { color: "#000000" },
                                        }}
                                        style={{ borderRadius: '50px' }}
                                        {...register('name')}
                                    />
                                    {errors.name && <span className='white-error'>{errors.name.message}</span>}
                                </div>
                                <div className={styles.textCenter}>
                                    <Button variant='contained' color='primary' disabled={submitting} className={classes.buttonProps} type='submit'>
                                        Add Repo
					</Button>
                                </div>
                            </form>
                        </div>
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
