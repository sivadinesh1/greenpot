import Layout from '../../../../components/Layout';
import Admin from '../../../../components/auth/Admin';
import React, { useRef, useCallback, useState, useEffect } from 'react';
import styles from '../../../../styles/Blog.module.scss';
import { signout, isAuth, getCompany } from '../../../../components/auth/auth';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAllCategories } from '../../../api/category/[...crud]';
import { getAllTags } from '../../../api/tag/[...crud]';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';

import theme from '../../../../theme';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import CancelIcon from '@material-ui/icons/Cancel';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutlineSharp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import dynamic from 'next/dynamic';
import BlogPreview from '../../../../components/crud/Blog/blog-preview';

import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

import { options } from '../../../../components/utils/sunEditor';

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	const categories = await getAllCategories(company_id);
	const tags = await getAllTags(company_id);

	return {
		props: { categories, tags },
	};
};

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	chip: {
		margin: 2,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	dialogPaper: {
		height: '400px',
	},
	margin: {
		margin: theme.spacing(1),
	},
	TextFieldProps: {
		color: '#fff',
		borderBottom: '1px solid #fff',
	},
	buttonProps: {
		fontSize: '1rem',
		borderRadius: '5em',
		padding: '8px 50px',
		textTransform: 'capitalize',
	},
}));

interface FormData {
	title: string;
	content: string;
	categories: any[];
	tags: any[];
}

export default function Index({ categories, tags }) {
	const classes = useStyles();

	const [blog, setBlog] = useState<FormData>();

	const [selectedTags, setSelectedTags] = useState([]);
	const [selectedCategorys, setSelectedCategorys] = useState([]);

	let schema = yup.object().shape({
		name: yup.string().required().min(3).max(72),
	});

	const {
		register,
		handleSubmit,
		getValues,
		watch,
		formState: { errors },
	} = useForm<FormData>({ mode: 'onTouched', resolver: yupResolver(schema) });

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [serverErrors, setServerErrors] = useState<Array<string>>([]);
	const [error, setError] = useState(false);

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

	const onSubmit = async (formData, event) => {
		if (submitting) {
			return false;
		}

		let tagsarr = [];

		console.log('test blog data', formData);
		const values = {
			// title, categories, tags, body, companyI
			title: formData.name,
			categories: formData.catArray,
			tags: formData.tagArray,
			// companyId: companyId,
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
			// onReloadBlogList();
			// handleSnackOpen('blog Successfully Added');
			event.target.reset();
		}
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
								{/* <div className={styles.rowGap}>
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
					</div> */}

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
									<Button variant='contained' color='primary' disabled={submitting} className={classes.buttonProps} type='submit'>
										Add Blog
									</Button>
								</div>
							</form>
						</div>

						{/* <div>
				<Dialog
					classes={{ paper: classes.dialogPaper }}
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
			</div> */}
					</div>
					<div className={styles.right}>
						<div style={{ color: 'red' }}>PREVIEW</div>

						<BlogPreview title={watch('title')} categories={selectedCategorys} body={contentBody}></BlogPreview>
					</div>
				</div>
			</Admin>
		</Layout>
	);
}
