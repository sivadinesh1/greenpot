import React, { useRef, useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

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

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	const categories = await getAllCategories(company_id);
	const tags = await getAllTags(company_id);

	return {
		props: { categories, tags },
	};
};

interface FormData {
	title: string;
	content: string;
	categories: any[];
	tags: any[];
}

export default function Index({ categories, tags, company_id }) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');

	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedCategorys, setSelectedCategorys] = useState([]);

	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(72),
	});

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

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
		console.log('dinesh' + editor.current);
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
		console.log('submit clicked');
		debugger;
		if (submitting) {
			return false;
		}

		let tagsarr = [];
		tags.forEach((e, i) => {
			if (selectedTags.includes(e.slug)) tagsarr.push(Number(e.id));
		});

		let categoriessarr = [];
		categories.forEach((e, i) => {
			if (selectedCategorys.includes(e.slug)) categoriessarr.push(Number(e.id));
		});

		formData.content = contentBody;
		formData.catArray = tagsarr;
		formData.tagArray = categoriessarr;
		console.log('test blog data', formData);
		const values = {
			title: formData.name,
			categories: formData.catArray,
			tags: formData.tagArray,
			companyId: company_id,
			body: formData.content,
		};
		console.log('test response value ----->', values);
		setSubmitting(true);
		setServerErrors([]);
		setError(false);

		const response = await axios.post(`/api/blog/crud`, values);
		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		setSubmitting(false);
		if (response.status === 201) {
			setSnack(true);
			setMessage('blog Successfully Added');

			event.target.reset();
		}
	};

	//cloudinary
	const [uploadedFiles, setUploadedFiles] = useState([]);

	const onDrop = useCallback(async (acceptedFiles) => {
		let path = 'company';
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
										{...register('title')}
									/>
									{errors.title && <span>{errors.title.message}</span>}
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
									{/* <Button variant='contained' color='primary' type='button' onClick={onSubmit}>Save</Button> */}
									<Button variant='contained' color='primary' type='submit'>
										Add Blog
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

						<BlogPreview title={watch('title')} categories={selectedCategorys} body={contentBody}></BlogPreview>
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
