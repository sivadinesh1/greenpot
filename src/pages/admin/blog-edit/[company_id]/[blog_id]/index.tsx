import React, { useRef, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
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

import { options } from '../../../../../components/utils/sunEditor';
import { useDropzone } from 'react-dropzone';

import styles from '../../../../../styles/Blog.module.scss';
import stylesd from '../../../../../styles/dropZone.module.css';

import BlogPreview from '../../../../../components/crud/Blog/blog-preview';

import { getTags, getAllTags } from '../../../../../service/tag.service';
import { getCategories, getAllCategories } from '../../../../../service/category.service';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { format, parseISO, formatDistance, formatRelative, subDays } from 'date-fns';
// do not delete this import, prevents warnings
import { alpha } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getImages } from '../../../../../service/cloudinary.service';
import { ErrorMessage } from '@hookform/error-message';
import { parseCookies } from '../../../../api/auth/user';

import { isEmpty } from '../../../../../components/utils/util';

export const getServerSideProps = async (context) => {
	// const company_id = context.params.company_id as string;
	 const blog_id = context.params.blog_id as string;
	let { user_id, company_id,role_id } = await parseCookies(context?.req);
	if (user_id === undefined || company_id === undefined ) {
		return {
			redirect: { destination: '/', permanent: false },
		};
	}

	let path = `C${company_id}/B${blog_id}`;

	let resp = await axios.get(`${process.env.API_URL}/blog/blogid/${blog_id}`);
	const blog = resp.data;
	const repo_id=resp.data.repo_id;
	const selectedTag = blog.tags.length > 0 ? await getTags(blog.tags) : [];
	const selectedCat = blog.categories.length > 0 ? await getCategories(blog.categories) : [];

	const categories = await getAllCategories(company_id);

	const tags = await getAllTags(company_id);

	const selectedImages = await getImages(path);

	return {
		props: { blog, categories, tags, company_id, selectedTag, selectedCat, selectedImages,repo_id },
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

type ErrorSummaryProps<T> = {
	errors: FieldErrors<T>;
};
function ErrorSummary<T>({ errors }: ErrorSummaryProps<T>) {
	if (Object.keys(errors).length === 0) {
		return null;
	}
	return (
		<div className='error-summary'>
			{Object.keys(errors).map((fieldName) => (
				<ErrorMessage errors={errors} name={fieldName as any} as='div' key={fieldName} />
			))}
		</div>
	);
}

type ErrorMessageContainerProps = {
	children?: React.ReactNode;
};
const ErrorMessageContainer = ({ children }: ErrorMessageContainerProps) => <span className='error'>{children}</span>;

export default function Index({ blog, categories, tags, company_id, selectedTag, selectedCat, selectedImages ,repo_id}) {
	const preloadedValues = {
		title: blog.title.startsWith('Untitled') ? '' : blog.title,
		description: blog.description,
		author: blog.author,
	};
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const uploadLimit = 2;

	const [uploadedFiles, setUploadedFiles] = useState(selectedImages.length > 0 ? selectedImages : []);

	const [selectedTags, setSelectedTags] = useState([...selectedTag]);

	const [selectedCategorys, setSelectedCategorys] = useState([...selectedCat]);

	let schema = yup.object().shape({
		title: yup.string().required('Title is required').min(3).max(72),
		description: yup.string().required('Description is required').max(200),
		author: yup.string().required('Author is required').max(50),
		categories: yup.string().nullable().notRequired(),
		tags: yup.string().nullable().notRequired(),
		// tags: yup.array().min(1,"select at least 1").required(),
		companyId: yup.string().nullable().notRequired(),
		body: yup.string().nullable().notRequired(),
	});
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid, errors },
		setValue,
		setError,
		control,
		reset,
	} = useForm<FormData>({ defaultValues: preloadedValues, mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);

	const [isError, setIsError] = useState(false);
	const [copy, setCopy] = useState(false);

	const [selectedDate, setSelectedDate] = React.useState(format(parseISO(blog.article_date), 'yyyy-MM-dd'));
	const [formattedDate, setFormattedDate] = React.useState(format(parseISO(blog.article_date), 'MMM dd, yyyy'));

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setFormattedDate(format(date, 'MMM dd, yyyy'));
	};

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
	const [contentBody, setContentBody] = useState(blog.body);
	const [contentInitBody, setContentInitBody] = useState(blog.body);

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
		if (!selectedTags.length || !selectedCategorys.length) {
			setIsError(true);
			return;
		}
		let status = event.nativeEvent.submitter.id === 'save' ? 'N' : 'Y';

		let tempCatIds = selectedCategorys.map((o) => o.id);
		let uniqCategorys = selectedCategorys.filter(({ id }, index) => !tempCatIds.includes(id, index + 1));

		let tempTagIds = selectedTags.map((o) => o.id);
		let uniqTags = selectedTags.filter(({ id }, index) => !tempTagIds.includes(id, index + 1));

		const values = {
			id: blog.id,
			title: formData.title,
			description: formData.description,
			author: formData.author,
			articleDate: parseISO(selectedDate),
			categories: uniqCategorys,
			tags: uniqTags,
			companyId: company_id,
			body: contentBody || '',
			status: status,
		};
		setSubmitting(true);
		setServerErrors([]);

		const response = await axios.put(`/api/blog`, values);
		if (response.data.errors) {
			setServerErrors(response.data.errors);
		}
		if (response.status === 200) {
			setError('title', {
				type: 'server',
				message: 'Title already exists',
			});
		}
		setSubmitting(false);
		if (response.status === 201) {
			setSnack(true);
			setMessage('blog Updated successfully');

			event.target.reset();
			reset();
			console.log("test repo id---->",repo_id)
			Router.push(`/admin/blogs/${Number(repo_id)}`);
		}
	};

	//cloudinary delete image
	const removeImage = async (file) => {
		const data={ publicId: file.public_id, folder: file.folder,operation:"DELETE" }
		const response = await axios.post(`/api/blog`, data);
		setUploadedFiles([...response.data]);
	};

	//cloudinary
	const onDrop = useCallback(async (acceptedFiles) => {
		let path = `C${company_id}/B${blog.id}/`;
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
		disabled: uploadedFiles.length === uploadLimit ? true : false,
	});

	return (
		<>
			<div className={styles.blog_wrap}>
				<div className={styles.left}>
					<div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div>
								<Controller
									name='title'
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<TextField
											type='text'
											label='Title'
											margin='dense'
											variant='standard'
											size='small'
											fullWidth
											error={!!errors.title}
											helperText={errors?.title?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div>
								<Controller
									name='description'
									control={control}
									rules={{ required: true }}
									render={({ field }) => (
										<TextField
											type='text'
											label='Subtitle'
											margin='dense'
											variant='standard'
											size='small'
											multiline
											minRows={1}
											maxRows={2}
											fullWidth
											error={!!errors.description}
											helperText={errors?.description?.message}
											{...field}
										/>
									)}
								/>
							</div>
							<div style={{ paddingTop: '10px' }}>
								<label style={{ color: '#eee', fontSize: '12px' }}>Article</label>
								<SunEditor
									disable={false}
									disableToolbar={false}
									lang='en'
									name='content'
									setContents={contentInitBody}
									setOptions={options}
									width='100%'
									height='400px'
									onChange={handleCMSChange}
									//  onChange={(content) => handleCMSChange(content)}

									// onImageUploadBefore={handleImageUploadBefore}
									// imageUploadHandler={imageUploadHandler}
								/>
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
								{!selectedCategorys.length && isError && <div style={errorStyle}>Select at least 1 category</div>}
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
									renderInput={(params) => <TextField {...params} variant='standard' placeholder='Select Relevant Tags' margin='normal' fullWidth />}
								/>
								{!selectedTags.length && isError && <p style={errorStyle}>Select at least 1 Tag</p>}
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
								<div style={{ marginRight: '10px', marginTop: '10px' }}>
									<Controller
										name='author'
										control={control}
										rules={{ required: true }}
										render={({ field }) => (
											<TextField
												type='text'
												label='Author'
												margin='dense'
												variant='standard'
												size='small'
												fullWidth
												error={!!errors.author}
												helperText={errors?.author?.message}
												{...field}
											/>
										)}
									/>
								</div>

								<div style={{ marginLeft: '10px' }}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker
											margin='normal'
											id='date-picker-dialog'
											label='Article Date'
											views={['year', 'month', 'date']}
											value={selectedDate}
											format='yyyy-MM-dd'
											onChange={handleDateChange}
											KeyboardButtonProps={{
												'aria-label': 'change date',
											}}
											fullWidth
										/>
									</MuiPickersUtilsProvider>
								</div>
							</div>
							<div>
								<div {...getRootProps()} className={`${stylesd.dropzone} ${isDragActive ? stylesd.active : null}`}>
									<input {...getInputProps()} />
									Drop Zone
								</div>
								{uploadedFiles.length === uploadLimit && <p style={errorStyle}>upload Limit {uploadLimit}</p>}
								<span>
									{uploadedFiles.length > 0 && (
										<Button onClick={handleOpenDialog} variant='outlined' style={{ backgroundColor: '#FFFFFF', color: '#12824C' }}>
											Show Gallery
										</Button>
									)}
								</span>
							</div>

							{!isEmpty(errors) ? (
								<div>
									<div className='error-header'>
										<span style={{ borderBottom: '1px solid red', fontWeight: 'bold', paddingBottom: '2px' }}>Please fix below errors</span>
									</div>
									<ErrorSummary errors={errors} />
								</div>
							) : (
								''
							)}
							<div className={styles.textCenter}>
								{/* disabled={!formState.isValid} */}
								<Button variant='contained' color='primary' type='submit' id='save' style={{ marginRight: '10px' }}>
									Save
								</Button>
								<Button variant='contained' color='primary' type='submit' id='publish' style={{ marginLeft: '10px' }}>
									Publish
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
											<div onClick={() => removeImage(file)}>
												<Image src='/static/images/close.svg' alt='close' width='10px' height='10px' />
											</div>
											<Image cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME} publicId={file.public_id} width='100' crop='scale' />

											<div className={styles.textCenter}>
												<CopyToClipboard text={file.url} onCopy={() => setCopy(true)}>
													<Button>Copy</Button>
												</CopyToClipboard>
											</div>
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
						title={watch('title', blog.title.startsWith('Untitled') ? '' : blog.title)}
						description={watch('description', blog.description)}
						author={watch('author', blog.author)}
						categories={selectedCategorys}
						body={contentBody}
						articleDate={formattedDate}></BlogPreview>
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

async function getSignature(folderPath) {
	const response = await fetch(`/api/cloudinary/${folderPath}`);
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}

// https://cloudinary.com/documentation/admin_api
// bs","categories":[117],"tags":[7],"created_by":null,"created_date":"2021-08-12T02:24:19.829Z","modified_by":null,"modified_date":null,"companyid":"1","isdelete":"N","description":"Digital Interviewing – the path to a smooth interview process","author":"Mehul Butt","article_date":"2021-08-12T15:35:00.000Z","status":"D","published":"N","published_datetime":"2021-08-12T15:35:48.590Z"}
// https://stackoverflow.com/questions/65805358/react-hook-form-validation-with-material-ui
