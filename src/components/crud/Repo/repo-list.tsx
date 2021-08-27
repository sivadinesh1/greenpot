import { useState } from 'react';
import styles from '../../../styles/dashboard.module.css';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Router from 'next/router';
import Image from 'next/image';
import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import { mutate } from 'swr';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { TextField } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import useSWR from 'swr';



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

export default function RepoList({ repos, companyId }) {
	// const [data, setData] = useState(repos);
	const [showCreate, setShowCreate] = useState(false );
	const classes = useStyles();

	let schema = yup.object().shape({
        name: yup.string().required().min(3).max(60),
	});
	
	const { data, mutate } = useSWR(`${process.env.API_URL}/repository/${companyId}`, {
		initialData: repos,
	});

	const reloadList = () =>{
		mutate();
	}

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

	// const handleSnackOpen = (message) => {
    //     setSnack(true);
    //     setMessage(message);
    // };

    const onSubmit = async (formData, event) => {
        if (submitting) {
            return false;
        }
        const values = {
            name: formData.name,
            companyId: companyId,
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
            // Router.push("/dashboard")
			// handleSnackOpen('Repository Successfully Added');
			setOpenDialog(false);
			reloadList();
            event.target.reset();
        }
    }
	
	const create = () => {
		return (
			<div>
				<Link href={`/admin/repo/add`}>
					<p> click to create new Repo</p>
				</Link>
			</div>
		);
	};
	const add = () => {
		Router.push('admin/repo/add');
	};

	const addAuthor = () => {
		Router.push('admin/author/add');
	};

	const editRow = (id: string, event: any) => {
		event.stopPropagation();
		Router.push(`/admin/repo/edit/${id}`);
	};

	//dialog box
	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 300px' }}>
				<div> &nbsp;</div>
				<div style={{ fontSize: '1.3rem', padding: '1rem' }}>
				<Button onClick={() => handleOpenDialog()} type='button' variant='contained' color='primary' style={{ float: 'left', marginRight: '10px' }}>
					{/* <Button onClick={() => add()} type='button' variant='contained' color='primary' style={{ float: 'left', marginRight: '10px' }}> */}
						Add New
					</Button>
					<Button onClick={() => addAuthor()} type='button' variant='contained' color='primary' style={{ float: 'left' }}>
						Author
					</Button>
				</div>
			</div>

			<div className={styles.wrapper}>
				{data &&
					!showCreate &&
					data.map((d, index) => {
						return (
							<div>
								<div className={styles.card}>
									<Link href={`/admin/blogs/${d.repo_id}`}>
										<div className={styles.card_title}>
											<p> {d.name}</p>
										</div>
									</Link>
									<div>
										<div className={styles.btnGroup} onClick={(event) => editRow(d.repo_id, event)}>
											Click to Edit
											<Image src='/static/images/edit.svg' alt='edit' width='15px' height='15px' />
										</div>
									</div>
								</div>
							</div>
						);
					})}
				{showCreate && create()}
			</div>


				<div>
					<Dialog
						// classes={{ paper: classes.dialogPaper }}
						fullWidth={true}
						maxWidth='md'
						open={openDialog}
						onClose={handleCloseDialog}
						aria-labelledby='max-width-dialog-title'>
							<div className={styles.textCenter}>
									<DialogTitle id='customized-dialog-title'>Repository Add</DialogTitle>
							</div>
						<DialogContent dividers>
							
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
                            
						{/* <DialogActions> */}
						<Divider />

						<div className={styles.textCenter}>
						<Button variant='contained' disabled={submitting} type='submit' color='primary' style={{margin:"10px"  }}>Submit</Button>
						<Button onClick={handleCloseDialog} variant='contained' color='primary'style={{margin:"10px"  }}>Back</Button>							
						</div>
                            </form>
						</DialogContent>
							
						{/* </DialogActions> */}
					</Dialog>
				</div>
		</div>


	);
}
