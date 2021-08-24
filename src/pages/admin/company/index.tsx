import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import styles from '../../../styles/company.module.scss';
import { parseCookies } from '../../api/auth/user';
import axios from 'axios';
import useSWR from 'swr';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


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

    // both works dont delete
    //const categorys = await getAllCategories(company_id);

    let resp = await axios.get(`${process.env.API_URL}/company/getById/${company_id}`);
    let companies = resp.data[0];

    return {
        props: { companies },
    };
};

export default function Index({ companies }) {
    const [snack, setSnack] = useState(false);
    const [message, setMessage] = useState('');

    let schema = yup.object().shape({
        name: yup.string().required().min(3).max(60),
        companyUrl: yup.string().notRequired(),
        websiteUrl: yup.string().notRequired(),
        about: yup.string().notRequired().max(300),
        logo: yup.string().notRequired(),
    });

    const preloadedValues = {
        name: companies.name,
        // companyUrl: companies.name === undefined ? '' : companies.name ,
        // websiteUrl: companies.website_url === null ? '' : companies.website_url ,
        // about: companies.about === null ? '' : companies.about ,
        // logo: companies.logo === null ? '' : companies.logo 
    };

    const {
        setValue,
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: preloadedValues,
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

    useEffect(() => {
        setValue('name', companies.name);
        setValue('websiteUrl', companies.website_url === null ? '' : companies.website_url);
        setValue('logo', companies.logo === null ? '' : companies.logo);
        setValue('about', companies.about === null ? '' : companies.about);
    }, [companies.name]);


    const onSubmit = async (formData, event) => {
        console.log("test form data--->",formData)
        if (submitting) {
			return false;
		}

		const company = {
            id:companies.id,
			name: formData.name,
			logo: formData.logo,
            website_url: formData.websiteUrl,
            about:formData.about
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		axios.put(`/api/company`, company).then(function (response) {
			if (response.data.errors) {
				setServerErrors(response.data.errors);
				setError(true);
			}

			setSubmitting(false);
			if (response.status === 200) {
				handleSnackOpen('Profile Successfully Updated');
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
                                Profile
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
                                        name='websiteUrl'
                                        control={control}
                                        // rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                type='text'
                                                label='Web Site URL'
                                                margin='dense'
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                                error={!!errors.websiteUrl}
                                                helperText={errors?.websiteUrl?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                <div className={styles.formGap}>
                                    <Controller
                                        name='logo'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                type='text'
                                                label='Logo'
                                                margin='dense'
                                                variant='standard'
                                                size='small'
                                                fullWidth
                                                error={!!errors.logo}
                                                helperText={errors?.logo?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>
                                {/* <div className={styles.formGap}>
                                    <Controller
                                        name='about'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextareaAutosize 
                                            aria-label="minimum height"
                                             minRows={3} 
                                             placeholder="Minimum 3 rows" 
                                              error={!!errors.about}
                                             helperText={errors?.about?.message}
                                             fullWidth
                                             />
                                        )}
                                    />
                                </div> */}
                                <div className={styles.formGap}>
                                <Controller
									name='about'
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<TextField
											type='text'
											label='About'
											margin='dense'
											variant='standard'
											size='small'
											multiline
											minRows={1}
											maxRows={3}
											fullWidth
											error={!!errors.about}
											helperText={errors?.about?.message}
											{...field}
										/>
									)}
								/>
                                </div>

                                
                                <div className={styles.textCenter}>
                                    <ColorButton variant='contained' color='primary' className={classes.buttonProps} type='submit'>
                                        Update
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
