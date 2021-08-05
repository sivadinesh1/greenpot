import React, { useRef, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Image } from 'cloudinary-react';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

import { options } from '../../../../components/utils/sunEditor';
import { useDropzone } from 'react-dropzone';

import styles from '../../../../styles/Blog.module.scss';
import stylesd from '../../../../styles/dropZone.module.css';
import Layout from '../../../../components/Layout';
import Admin from '../../../../components/auth/Admin';
import BlogPreview from '../../../../components/crud/Blog/blog-preview';
import { getAllCategories } from '../../../api/category/[...crud]';
import { getAllTags } from '../../../api/tag/[...crud]';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import { format, formatDistance, formatRelative, subDays } from 'date-fns';
// do not delete this import, prevents warnings
import { alpha } from '@material-ui/core/styles';

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	const categories = await getAllCategories(company_id);
	const tags = await getAllTags(company_id);

	return {
		props: { categories, tags, company_id },
	};
};

interface FormData {
	title: string;
	description: string;
	author: string;
	articleDate: Date;
	content: string;
	categories: any[];
	tags: any[];
}

const useStyles = makeStyles((theme) => ({
	root: {
		'& .MuiTextField-root': {
			margin: theme.spacing(1),
		},
	},
	textarea: {
		resize: 'both',
	},
}));

export default function Index({ categories, tags, company_id }) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');

	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedCategorys, setSelectedCategorys] = useState([]);
	const classes = useStyles();

	let schema = yup.object().shape({
		title: yup.string().required().min(3).max(72),
		description: yup.string().nullable().notRequired().max(200),
		author: yup.string().nullable().notRequired().max(50),
		categories: yup.string().nullable().notRequired(),
		tags: yup.string().nullable().notRequired(),
		companyId: yup.string().nullable().notRequired(),
		body: yup.string().nullable().notRequired(),
	});
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);
	const [duplicate, setDuplicate] = useState(false);

	//error style
	let errorStyle = {
		color: 'red',
		content: '⚠ ',
	};
	//dialog box
	const [openDialog, setOpenDialog] = React.useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	/**
	 * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
	 */
	const editor = useRef();

	// The sunEditor parameter will be set to the core suneditor instance when this function is called

	const getSunEditorInstance = (sunEditor) => {
		editor.current = sunEditor;
	};

	//sunEditor
	const [contentBody, setContentBody] = useState();
	const content = '';

	const handleCMSChange = (content) => {
		setContentBody(content);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const onSubmit = async (formData, event) => {
		if (submitting) {
			return false;
		}
		const values = {
			title: formData.title || '',
			description: formData.description || '',
			author: formData.author || '',
			articleDate: formData.articleDate,
			categories: selectedCategorys,
			tags: selectedTags,
			companyId: company_id,
			body: contentBody || '',
		};

		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/blog/crud`, values);
		// console.log("check error --->",response)
		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}
		if (response.status === 200) {
			setDuplicate(true);
			setTimeout(() => {
				setDuplicate(false);
			}, 5000);
		}
		setSubmitting(false);
		if (response.status === 201) {
			setSnack(true);
			setMessage('blog Successfully Added');

			event.target.reset();
			reset();
			Router.push(`/admin/blogs/${company_id}`);
		}
	};

	//cloudinary
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const onDrop = useCallback(async (acceptedFiles) => {
		let path = `C${company_id}/B${4}/`;
		const { signature, timestamp } = await getSignature(path);
		const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;

		acceptedFiles.forEach(async (acceptedFile) => {
			//login verification

			const formData = new FormData();
			formData.append('file', acceptedFile);
			formData.append('signature', signature);
			formData.append('timestamp', timestamp);
			formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
			formData.append('folder', path);

			const response = await fetch(url, {
				method: 'post',
				body: formData,
			});
			const data = await response.json();
			setUploadedFiles((old) => [...old, data]);
		});
	}, []);

	//drop zone
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: 'image/*',
		multiple: false,
	});

	const [selectedDate, setSelectedDate] = React.useState(new Date());

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	return (
		<Layout>
			<Admin>
				<div className={styles.blog_wrap}>
					<div className={styles.left}>
						<div>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className={styles.rowGap}>
									<TextField
										type='text'
										label='Title for the article'
										margin='dense'
										name='title'
										variant='standard'
										size='small'
										fullWidth
										error={errors?.title ? true : false}
										{...register('title')}
									/>
									{duplicate && <p style={errorStyle}>Title already exist</p>}
								</div>
								<div className={styles.rowGap}>
									<TextField
										id='outlined-textarea'
										label='Description'
										multiline
										minRows={1}
										maxRows={2}
										variant='standard'
										fullWidth
										{...register('description')}
										inputProps={{ className: classes.textarea }}
									/>
								</div>
								<div className={styles.rowGap}>
									<TextField
										type='text'
										label='Author'
										margin='dense'
										name='author'
										variant='standard'
										size='small'
										fullWidth
										error={errors?.author ? true : false}
										{...register('author')}
									/>
								</div>
								<div>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker
											margin='normal'
											id='date-picker-dialog'
											label='Date picker dialog'
											views={['year', 'month', 'date']}
											value={selectedDate}
											format='yyyy-MM-dd'
											onChange={handleDateChange}
											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
										/>
									</MuiPickersUtilsProvider>

									{/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker
											disableToolbar
											variant='inline'
											format='MM/dd/yyyy'
											margin='normal'
											id='date-picker-inline'
											label='Date picker inline'
											value={selectedDate}
											onChange={handleDateChange}
											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
										/>
									</MuiPickersUtilsProvider> */}
									{/* <TextField
										id="dateTimeFrom"                                        
										type="date"
										variant="standard"
										defaultValue={new Date()}
										label='ArticleDate'
										margin='dense'
										name='articleDate'
										size='small'
										fullWidth
										{...register('articleDate')}
									/> */}
								</div>
								<div className={styles.rowGap}>
									<SunEditor
										disable={false}
										disableToolbar={false}
										height='100%'
										lang='en'
										name='content'
										setContents={content}
										setOptions={options}
										width='100%'
										onChange={handleCMSChange}
										// onImageUploadBefore={handleImageUploadBefore}
										// imageUploadHandler={imageUploadHandler}
									/>
								</div>
								<div className={styles.rowGap}>
									<div {...getRootProps()} className={`${stylesd.dropzone} ${isDragActive ? stylesd.active : null}`}>
										<input {...getInputProps()} />
										Drop Zone
									</div>
									<span>
										{uploadedFiles.length > 0 && (
											<Button onClick={handleOpenDialog} variant='outlined' style={{ backgroundColor: '#FFFFFF', color: '#12824C' }}>
												Show Gallery
											</Button>
										)}
									</span>
								</div>

								<div>
									<Autocomplete
										multiple
										id='tags-standard'
										freeSolo
										filterSelectedOptions
										fullWidth
										options={categories}
										onChange={(e, newValue) => setSelectedCategorys(newValue)}
										getOptionLabel={(option) => option.name}
										value={selectedCategorys}
										renderInput={(params) => (
											<TextField {...params} variant='standard' placeholder='Select Relevant Categories' margin='normal' fullWidth />
										)}
									/>
								</div>

								<div>
									<Autocomplete
										multiple
										id='tags-standard'
										freeSolo
										filterSelectedOptions
										fullWidth
										options={tags}
										onChange={(e, newValue) => setSelectedTags(newValue)}
										getOptionLabel={(option) => option.name}
										value={selectedTags}
										renderInput={(params) => (
											<TextField {...params} variant='standard' placeholder='Select Relevant Tags' margin='normal' fullWidth />
										)}
									/>
								</div>

								<div className={styles.textCenter}>
									<Button variant='contained' color='primary' type='submit'>
										Save as Draft
									</Button>
								</div>
							</form>
						</div>

						<div>
							<Dialog
								// classes={{ paper: classes.dialogPaper }}
								fullWidth={true}
								maxWidth='lg'
								open={openDialog}
								onClose={handleCloseDialog}
								aria-labelledby='max-width-dialog-title'>
								<DialogTitle id='customized-dialog-title'>Image Gallery</DialogTitle>
								<DialogContent dividers>
									<div style={{ display: 'grid', padding: '6px 6px', gridTemplateColumns: 'repeat(7, 1fr)', margin: 'auto auto' }}>
										{uploadedFiles.map((file) => (
											<div key={file.public_id} style={{ margin: '10px auto' }}>
												<Image cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME} publicId={file.public_id} width='100' crop='scale' />
											</div>
										))}
									</div>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleCloseDialog} color='primary'>
										Back
									</Button>
								</DialogActions>
							</Dialog>
						</div>
					</div>
					<div className={styles.right}>
						<div style={{ color: 'red' }}>PREVIEW</div>

						<BlogPreview
							title={watch('title')}
							description={watch('description')}
							author={watch('author')}
							categories={selectedCategorys}
							body={contentBody}></BlogPreview>
					</div>
				</div>

				<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
					<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
						{message}
					</MuiAlert>
				</Snackbar>
			</Admin>
		</Layout>
	);
}

async function getSignature(folderPath) {
	const response = await fetch(`/api/cloudinary/${folderPath}`);
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}
