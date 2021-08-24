import React, { useState, useEffect } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { getRepo } from '../../../../service/repository.service'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ConfirmDialog from '../../../../components/elements/ui/Dialog/ConfirmDialog';





export const getServerSideProps = async (context) => {
    let { user_id, company_id } = await parseCookies(context?.req);
    if (user_id === undefined || company_id === undefined) {
        return {
            redirect: { destination: '/', permanent: false },
        };
    }
    const repo_id = context.query.id
    const repo = await getRepo(repo_id);
    return {
        props: { company_id, repo },
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

export default function Index({ company_id, repo }) {
    const [openDialog, setOpenDialog] = useState(false);
	const [currentId, setCurrentId] = useState('');
    const [snack, setSnack] = useState(false);
    const [message, setMessage] = useState('');
    //let categorysList: Category[] = data;

    let schema = yup.object().shape({
        name: yup.string().required().min(3).max(60),
    });

    const preloadedValues = {
        name: repo.name,
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

    const deleteRepo =(id: string) =>{
        setCurrentId(id);
		setOpenDialog(true);
    }

    useEffect(() => {
        setValue('name', repo.name);
    }, [repo.name]);


    const handleConfirm = async () => {
        setOpenDialog(false);
		let response = await axios.delete(`/api/repository/repo/${currentId}`);

		if (response.status === 200) {  
            handleSnackOpen('Repository deleted Added');
            Router.push("/dashboard")
		}
	};

    const onSubmit = async (formData, event) => {
        console.log("test form data--->", formData)
        if (submitting) {
            return false;
        }
        const values = {
            id: repo.id,
            name: formData.name,
            companyId: company_id,
            status: "A"
        };
        setSubmitting(true);
        setServerErrors([]);
        setError(false);

        const response = await axios.put(`/api/repository`, values);

        if (response.data.errors) {
            setServerErrors(response.data.errors);
            setError(true);
        }

        setSubmitting(false);

        if (response.status === 200) {
            Router.push("/dashboard")
            handleSnackOpen('Repository Updated Added');
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', padding: '1rem' }}>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                            }}> Edit Repository</div>
                            <div>
                                <div style={{ fontSize: '1.3rem', marginRight: '10px' }}>
                                    <ButtonGroup color="primary" aria-label="outlined primary button group">
                                        <Button onClick={() => Router.back()}>Back</Button>
                                        <Button onClick={()=> deleteRepo(repo.id)}>Delete</Button>
                                    </ButtonGroup>
                                </div>

                            </div>
                        </div>
                        <div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className={styles.formGap}>
                                    {/* <TextField
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
                                    /> */}
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
                                <div className={styles.textCenter}>
                                    <ColorButton variant='contained' color='primary' disabled={submitting} className={classes.buttonProps} type='submit'>
                                        Edit Repo
					</ColorButton>
                                </div>
                            </form>


                        </div>



                    </div>
                </div>
            </div>

            <ConfirmDialog
				open={openDialog}
				handleClose={() => {
					setOpenDialog(false);
				}}
				handleConfirm={() => {
					handleConfirm();
				}}
				title='Warning Repo Deletion !'>
				You are about to delete Repository. Are you sure?
			</ConfirmDialog>

            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
                <MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
                    {message}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
