import React, { useRef, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import { Button, MenuItem } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Image } from 'cloudinary-react';

import { useDropzone } from 'react-dropzone';

import styles from '../../../../styles/Blog.module.scss';

import stylesd from '../../../../styles/dropZone.module.css';

import BlogPreview from '../../../../components/crud/Blog/blog-preview';

import { getTags, getAllTags } from '../../../../service/tag.service';
import { getCategories, getAllCategories } from '../../../../service/category.service';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

import { format, parseISO, formatDistance, formatRelative, subDays } from 'date-fns';
// do not delete this import, prevents warnings
import { alpha } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getImages } from '../../../../service/cloudinary.service';
import { ErrorMessage } from '@hookform/error-message';

import { getRepo } from '../../../../service/repository.service';
import { isEmpty } from '../../../../components/utils/util';
import { getUserById } from '../../../../service/auth/auth.service';
import ReactHookFormSelect from '../../../../components/ReactHookFormSelect';
import { forceLogout } from '../../../../components/auth/auth';
import { content } from '../../../../utils/content';
import { useSnapshot } from 'valtio';
import { FormInputText } from '../../../../components/forms/FormInputText';
import { FormInputDropdown } from '../../../../components/forms/FormInputDropdown';
import { FormInputDate } from "../../../../components/forms/FormInputDate";

let MyEditor;
if (typeof window !== 'undefined') {
	MyEditor = dynamic(() => import('../../../../components/Editor'));
}

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let blog_id = null;
	let user = null;
	let accessRights = null;
	let path = null;
	let authors_result = null;
	let authors = null;
	let resp = null;
	let blog = null;
	let selectedTag = null;
	let selectedCat = null;
	let repo = null;
	let repo_nano = null;
	let resultx = null;
	let categories = null;
	let company_id = null;
	let tags = null;
	let selectedImages = null;

	try {
		cookie = context?.req?.headers.cookie;
		blog_id = context.params.blog_id as string;
		user = await axios.get(`${process.env.API_URL}/auth/user`, {
			headers: {
				cookie: cookie!,
			},
		});
		accessRights = user?.data?.access_rights;
		path = `C${user?.data?.company_id}/B${blog_id}`;
		authors_result = await axios.get(`${process.env.API_URL}/author/company`, {
			headers: {
				cookie: cookie!,
			},
		});
		authors = authors_result.data;
		resp = await axios.get(`${process.env.API_URL}/blog/blogByNano/${blog_id}`, {
			headers: {
				cookie: cookie!,
			},
		});
		blog = resp.data;
		console.log("check data in serverside props--->", blog)
		selectedTag = blog?.tag?.length > 0 ? await getTags(blog.tag) : [];
		selectedCat = blog?.category?.length > 0 ? await getCategories(blog.category) : [];
		repo = await getRepo(resp.data.repo_id);
		repo_nano = repo.repo_id;

		resultx = await axios.get(`${process.env.API_URL}/category`, {
			headers: {
				cookie: cookie!,
			},
		});
		categories = resultx.data.categories;
		company_id = resultx.data.company_id;

		//const categories = await getAllCategories(company_id);
		tags = await getAllTags(company_id);

		selectedImages = await getImages(path);
	} catch (error) {
		console.log(`error in blog edit ${error}`);
		isError = true;
	}
	return {
		props: { blog, categories, tags, company_id, selectedTag, selectedCat, selectedImages, repo_nano, accessRights, authors, isError },
	};
};

interface FormData {
	title: string;
	description: string;
	author: string;
	blogDate: Date;
	blocks: string;
	categories: any[];
	tags: any[];
	thumbnail: string;
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

export default function Index({
	blog,
	categories,
	tags,
	company_id,
	selectedTag,
	selectedCat,
	selectedImages,
	repo_nano,
	accessRights,
	authors,
	isError,
}) {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);
	const preloadedValues = {
		title: blog.title.startsWith('Untitled') ? '' : blog.title,
		description: blog.description,
		author: blog.author,
		thumbnail: blog.thumbnail,
		layout: blog.layout
	};
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const uploadLimit = 2;

	const [uploadedFiles, setUploadedFiles] = useState(selectedImages?.length > 0 ? selectedImages : []);

	const [selectedTags, setSelectedTags] = useState([...selectedTag]);
	console.log("test pre selected values--->", selectedTag)
	const [selectedCategorys, setSelectedCategorys] = useState([...selectedCat]);
	const [showAssets, setShowAssets] = useState(false);
	const [showMetaSection, setShowMetaSection] = useState(false);

	let schema = yup.object().shape({
		title: yup.string().required('Title is required').min(3).max(72),
		description: yup.string().required('Description is required').max(200),
		author: yup.string().required('Author is required').max(50),
		categories: yup.string().nullable().notRequired(),
		tags: yup.string().nullable().notRequired(),
		company_id: yup.string().nullable().notRequired(),
		layout: yup.string().nullable().notRequired(),
		thumbnail: yup.string().nullable().notRequired(),
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

	const [isError1, setIsError1] = useState(false);
	const [copy, setCopy] = useState(false);

	const [selectedDate, setSelectedDate] = React.useState(format(parseISO(blog.blog_date), 'yyyy-MM-dd'));
	const [formattedDate, setFormattedDate] = React.useState(format(parseISO(blog.blog_date), 'MMM dd, yyyy'));

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

	//sunEditor
	// const [contentBody, setContentBody] = useState(blog.body);
	// const [contentInitBody, setContentInitBody] = useState(blog.body);

	const handleShowAssets = () => {
		setShowAssets(!showAssets);
		setShowMetaSection(false);
	};

	const handleShowMetaSection = () => {
		setShowMetaSection(!showMetaSection);
		setShowAssets(false);
	};

	// const handleCMSChange = (content) => {
	// 	setContentBody(content);
	// };

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};
	const snap = useSnapshot(content);

	const onSubmit = async (formData, event) => {
		if (submitting) {
			return false;
		}
		if (!selectedTags.length || !selectedCategorys.length) {
			setIsError1(true);
			return;
		}
		console.log("check form data ---->", formData)
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
			blogDate: parseISO(selectedDate),
			categories: uniqCategorys,
			tag: uniqTags,
			company_id: company_id,
			layout: formData.layout,
			status: status,
			createdAt: blog.published_on,
			thumbnail: formData.thumbnail,
		};
		if (snap.obj != null) values['content'] = snap.obj;
		console.log("test values data---->", values);

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
			Router.push(`/dashboard`);
		}
	};

	//cloudinary delete image
	const removeImage = async (file) => {
		const data = { publicId: file.public_id, folder: file.folder, operation: 'DELETE' };
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

	const options = [
		{ label: 'Classic', value: 'classic' },
		{ label: 'Classic pro', value: 'classic pro' },
	];

	return (
		<>
			<div className={styles.main_menu}>
				<div onClick={handleShowAssets}>Menu</div>
			</div>
			<div style={{ display: 'flex' }}>
				<div className={showAssets ? `${styles.normal}` : `${styles.hidden}`}>
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
				</div>
				<div className={styles.blog_wrap}>
					<div>
						<div>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className={styles.rowGap}>
									<FormInputText name='title' control={control} label='Title' variant='standard' />
								</div>
								<div className={styles.rowGap}>
									<FormInputText name='description' control={control} label='Subtitle' variant='standard' />
								</div>
								<div className={styles.rowGap}>
									<FormInputText name='thumbnail' control={control} label='Thumbnail' variant='standard' />
								</div>

								{!isEmpty(errors) ? (
									<div>
										<div className='error-header'>
											<span style={{ borderBottom: '1px solid red', fontWeight: 'bold', paddingBottom: '2px' }}>
												Please fix below errors
											</span>
										</div>
										<ErrorSummary errors={errors} />
									</div>
								) : (
										''
									)}

								{MyEditor && <MyEditor data={blog.content} />}

								<div className={styles.textCenter}>
									{/* disabled={!formState.isValid} */}
									<Button variant='contained' color='primary' type='submit' id='save' style={{ marginRight: '10px' }}>
										Save
									</Button>
									{accessRights != 'W' && (
										<Button variant='contained' color='primary' type='submit' id='publish' style={{ marginLeft: '10px' }}>
											Publish
										</Button>
									)}
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
												<Image
													cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
													publicId={file.public_id}
													width='100'
													crop='scale'
												/>

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
				</div>
				<div className={showMetaSection ? `${styles.r_normal}` : `${styles.r_hidden}`}>
					<div>META DATA</div>
					<div className={styles.rowGap}>
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
						{!selectedCategorys.length && isError1 && <div style={errorStyle}>Select at least 1 category</div>}
					</div>
					<div className={styles.rowGap}>
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
						{!selectedTags.length && isError1 && <p style={errorStyle}>Select at least 1 Tag</p>}
					</div>
					<div className={styles.rowGap}>
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
					{/* <div className={styles.rowGap}>
						<FormInputDate
							name='author'
							control={control}
							label='Airticle Date' />

					</div> */}
					<div className={styles.rowGap}>
						<FormInputDropdown
							name='author'
							control={control}
							width={'100%'}
							defaultValue={{ label: '', value: '' }}
							label='Select Author'						>
							{authors.map((author, index) => (
								<MenuItem key={index} value={author.first_name}>
									{author.first_name}
								</MenuItem>
							))}
						</FormInputDropdown>
					</div>
					<div className={styles.rowGap}>
						<FormInputDropdown
							name='layout'
							control={control}
							width={'100%'}
							defaultValue={{ label: '', value: '' }}
							label='Select Layout'
						>
							{options.map((option: any) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</FormInputDropdown>
					</div>
				</div>
			</div>
			<div className={showMetaSection ? `${styles.right_side_menu_expand}` : `${styles.right_side_menu}`}>
				<div onClick={handleShowMetaSection}>RMenu</div>
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
// bs","categories":[117],"tags":[7],"created_by":null,"created_date":"2021-08-12T02:24:19.829Z","modified_by":null,"modified_date":null,"company_id":"1","is_delete":"N","description":"Digital Interviewing – the path to a smooth interview process","author":"Mehul Butt","blog_date":"2021-08-12T15:35:00.000Z","status":"D","published":"N","published_datetime":"2021-08-12T15:35:48.590Z"}
// https://stackoverflow.com/questions/65805358/react-hook-form-validation-with-material-ui