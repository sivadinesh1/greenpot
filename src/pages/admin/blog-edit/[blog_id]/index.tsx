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
// import Admin from '../../../../components/auth/Admin';
import BlogPreview from '../../../../components/crud/Blog/blog-preview';
import { getAllCategories, getCategories } from '../../../api/category/[...crud]';
import { getAllTags, getTags } from '../../../api/tag/[...crud]';
import { getBlogById, getBlog } from '../../../api/blog/[...crud]';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { format, formatDistance, formatRelative, subDays } from 'date-fns';
// do not delete this import, prevents warnings
import { alpha } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getImages } from '../../../api/cloudinary/[...path]';

export const getServerSideProps = async (context) => {
	const company_id = 2;
	const blog_id = context.params.blog_id as string;
	let path = `C${company_id}/B${blog_id}`;
	const blog = await getBlogById(blog_id);
	const selectedTag = blog.tags.length > 0 ? await getTags(blog.tags) : [];
	const selectedCat = blog.categories.length > 0 ? await getCategories(blog.categories) : [];
	const categories = await getAllCategories(company_id);
	const tags = await getAllTags(company_id);
	const selectedImages = await getImages(path);

	return {
		props: { blog, categories, tags, company_id, selectedTag, selectedCat, selectedImages },
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

export default function Index({ blog, categories, tags, company_id, selectedTag, selectedCat, selectedImages }) {
	console.log('reached blog edit...');

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const uploadLimit = 2;
	// if(selectedTag.length > 0){
	// 	selectedTag.map((tag,id)=>{
	// 		selectedTag[id]["status"]=true
	// 	})
	// }
	if (tags.length > 0) {
		tags.forEach((tag, index) => {
			selectedTag.map((t, id) => {
				if (tag.name === t.name) tags[index]['status'] = true;
			});
		});
	}

	const [uploadedFiles, setUploadedFiles] = useState(selectedImages.length > 0 ? selectedImages : []);
	// const [uploadedFiles, setUploadedFiles] = useState([]);

	const [selectedTags, setSelectedTags] = useState([...selectedTag]);
	console.log('check selected tags----->', selectedTags);
	const [selectedCategorys, setSelectedCategorys] = useState([...selectedCat]);

	const classes = useStyles();

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
		reset,
		setValue,
	} = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	// useEffect(() => {
	// 	setValue("title", blog.title, {
	//         shouldValidate: true,
	//         shouldDirty: true
	//       })
	//   }, [register]);

	// defaultValues: { title: blog.title }
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);
	const [duplicate, setDuplicate] = useState(false);
	const [isError, setIsError] = useState(false);
	const [copy, setCopy] = useState(false);

	const [selectedDate, setSelectedDate] = React.useState(blog.article_date);

	const handleDateChange = (date) => {
		setSelectedDate(date);
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
	const content = blog.body;

	const handleCMSChange = (content) => {
		console.log('inside handle cms change');
		setContentBody(content);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const onSubmit = async (formData, event) => {
		console.log('test -->', formData);
		if (submitting) {
			return false;
		}
		if (!selectedTags.length || !selectedCategorys.length) {
			setIsError(true);
			return;
		}
		let status = event.nativeEvent.submitter.id === 'save' ? 'N' : 'Y';
		const values = {
			id: blog.id,
			title: formData.title,
			description: formData.description,
			author: formData.author,
			articleDate: selectedDate,
			categories: selectedCategorys,
			tags: selectedTags,
			companyId: company_id,
			body: contentBody || '',
			status: status,
		};
		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		const response = await axios.put(`/api/blog/crud`, values);
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
			setMessage('blog Updated successfully');

			event.target.reset();
			reset();
			Router.push(`/admin/blogs/${company_id}`);
		}
	};

	//cloudinary delete image
	const removeImage = async (data) => {
		console.log('test image request data---->', data);
		const response = await axios.post(`/api/blog/crud/image/delete`, data);
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
								<TextField
									type='text'
									label='Title for the article *'
									margin='dense'
									name='title'
									variant='standard'
									size='small'
									fullWidth
									error={errors?.title ? true : false}
									{...register('title')}
									defaultValue={blog.title}
								/>
								<div style={errorStyle}>{errors.title?.message}</div>
								{duplicate && <p style={errorStyle}>Title already exist</p>}
							</div>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
								<div style={{ marginRight: '10px', marginTop: '10px' }}>
									<TextField
										type='text'
										label='Author *'
										margin='dense'
										name='author'
										variant='standard'
										size='small'
										fullWidth
										error={errors?.author ? true : false}
										{...register('author')}
										defaultValue={blog.author}
									/>
									<p style={errorStyle}>{errors.author?.message}</p>
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
								<TextField
									id='outlined-textarea'
									label='Description *'
									name='description'
									multiline
									minRows={1}
									maxRows={2}
									variant='standard'
									fullWidth
									{...register('description')}
									inputProps={{ className: classes.textarea }}
									defaultValue={blog.description}
									error={errors?.description ? true : false}
								/>
								<p style={errorStyle}>{errors.description?.message}</p>
							</div>

							<div>
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
									//	onChange={() => handleCMSChange(content)}

									// onImageUploadBefore={handleImageUploadBefore}
									// imageUploadHandler={imageUploadHandler}
								/>
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
								{!selectedCategorys.length && isError && <p style={errorStyle}>Select at least 1 category</p>}
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
										<TextField {...params} variant='standard' placeholder='Select Relevant Categories' margin='normal' fullWidth />
									)}
								/>
								{!selectedTags.length && isError && <p style={errorStyle}>Select at least 1 Tag</p>}
							</div>

							{/* <div>
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
								{!selectedTags.length && isError && <p style={errorStyle}>Select at least 1 tag</p>}
							</div> */}

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
											<div onClick={() => removeImage({ publicId: file.public_id, folder: file.folder })}>
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
						title={watch('title', blog.title)}
						description={watch('description')}
						author={watch('author')}
						categories={selectedCategorys}
						body={contentBody}
						articleDate={watch('articleDate')}></BlogPreview>
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
