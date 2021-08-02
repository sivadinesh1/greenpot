import React, { useRef, useCallback, useState, useEffect } from 'react';
import styles from '../../../styles/Blog.module.scss';
import axios from 'axios';
import { getCookie, getCompany } from '../../auth/auth';

import ConfirmDialog from '../../elements/ui/Dialog/ConfirmDialog';
import useSWR, { mutate, trigger } from 'swr';
import dynamic from 'next/dynamic';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { Button } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import { useForm, Controller } from 'react-hook-form';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });
import { options } from '../../../components/utils/sunEditor';
import { useDropzone } from 'react-dropzone';
import { Image } from 'cloudinary-react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import stylesd from '../../../styles/dropZone.module.css';
import theme from '../../../../src/theme';

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

function getStyles(name, personName, theme) {
	return {
		fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
	};
}

interface FormData {
	name: string;
	content: string;
	catArray: any[];
	tagArray: any[];
}
const ColorButton = withStyles((theme) => ({
	root: {
		color: '#000',
		backgroundColor: '#fff',
		'&:hover': {
			backgroundColor: '#f0f0ff',
		},
	},
}))(Button);

export default function BlogAdd({ blogs, handleSnackOpen, onReloadBlogList, onMode }) {
	var companyId = getCompany();

	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);
	const [selectedCat, setselectedCat] = React.useState([]);
	const [selectedTag, setselectedTag] = React.useState([]);
	//load initial value
	useEffect(() => {
		initCategories();
		initTags();
	}, []);

	const initCategories = async () => {
		await axios.get(`/api/category/crud/company/${companyId}`).then((res) => {
			if (res.status === 200) {
				let temp = res.data;

				temp.forEach((element) => {
					element.status = false;
				});

				setCategories(temp);
			} else {
				// setValues({ ...values, error: 'Something went wrong' });
			}
		});
	};

	const initTags = async () => {
		await axios.get(`/api/tag/crud/company/${companyId}`).then((res) => {
			if (res.status === 200) {
				let temp = res.data;

				temp.forEach((element) => {
					element.status = false;
				});

				setTags(temp);
			} else {
				// setValues({ ...values, error: 'Something went wrong' });
			}
		});
	};

	//handle dropdown
	const handleMultiDropDown = (event) => {
		if (event.target.name === 'category') setselectedCat(event.target.value);
		if (event.target.name === 'tag') setselectedTag(event.target.value);
	};

	//sunEditor
	const [contentBody, setContentBody] = useState();
	const content = '';
	//dialog box
	const [openDialog, setOpenDialog] = React.useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

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

	const onSubmit = async (formData, event) => {
		if (submitting) {
			return false;
		}

		let tagsarr = [];
		tags.forEach((e, i) => {
			if (selectedTag.includes(e.slug)) tagsarr.push(Number(e.id));
		});

		let categoriessarr = [];
		categories.forEach((e, i) => {
			if (selectedCat.includes(e.slug)) categoriessarr.push(Number(e.id));
		});

		formData.content = contentBody;
		formData.catArray = tagsarr;
		formData.tagArray = categoriessarr;
		console.log('test blog data', formData);
		const values = {
			// title, categories, tags, body, companyI
			title: formData.name,
			categories: formData.catArray,
			tags: formData.tagArray,
			companyId: companyId,
			body: formData.content,
		};
		console.log('test response value ----->', values);
		setSubmitting(true);
		setServerErrors([]);
		setError(false);
		mutate(`/api/blog/crud/company/${companyId}`, [...blogs, values], false);
		mutate(`/api/blog/crud/company/${companyId}`);
		const response = await axios.post(`/api/blog/crud`, values);
		if (response.data.errors) {
			setServerErrors(response.data.errors);
			setError(true);
		}

		setSubmitting(false);
		if (response.status === 201) {
			onReloadBlogList();
			handleSnackOpen('blog Successfully Added');
			event.target.reset();
		}
	};
	const classes = useStyles();

	/**
	 * @type {React.MutableRefObject<SunEditor>} get type definitions for editor
	 */
	const editor = useRef();

	// The sunEditor parameter will be set to the core suneditor instance when this function is called

	const getSunEditorInstance = (sunEditor) => {
		editor.current = sunEditor;
		console.log('dinesh' + editor.current);
	};

	const handleCMSChange = (content) => {
		setContentBody(content);
	};

	const handleImageUploadBefore = (files, info, imageUploadHandler) => {
		// uploadHandler is a callback function
		// use this to upload image to cloudinary
		// console.log(files, info);
	};

	const imageUploadHandler = (xmlHttpRequest, info, core) => {
		console.log(xmlHttpRequest, info, core);
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

	const handleBack = () => {
		onMode('list');
	};
	return (
		<div>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 100px' }}>
				<div
					style={{
						fontSize: '2rem',
						fontWeight: 'bold',
					}}>
					{' '}
					Blog Add
				</div>
				<div style={{ fontSize: '1.3rem', padding: '1rem' }}>
					<Button onClick={() => handleBack()} type='button' variant='contained' color='primary'>
						Back
					</Button>
				</div>
			</div>

			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.rowGap}>
						<TextField
							type='text'
							label='Blog Name '
							margin='dense'
							name='name'
							variant='standard'
							size='small'
							fullWidth
							InputProps={{
								className: classes.TextFieldProps,
							}}
							InputLabelProps={{
								style: { color: '#000000' },
							}}
							style={{ borderRadius: '50px' }}
							{...register('name')}
						/>
						{errors.name && <span className='white-error'>{errors.name.message}</span>}
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
					<div className={styles.rowGap}>
						<InputLabel id='demo-mutiple-chip-label' style={{ color: '#000000' }}>
							Category *
						</InputLabel>
						<Select
							labelId='demo-mutiple-chip-label'
							id='demo-mutiple-chip'
							multiple
							name='category'
							value={selectedCat}
							onChange={handleMultiDropDown}
							// open={openCat}
							// onClose={handleClose}
							input={<Input id='select-multiple-chip' />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{categories.map((value) => (
										<Chip key={value} label={value} className={classes.chip} />
									))}
								</div>
							)}
							style={{ color: '#000000' }}>
							{categories.map((c) => (
								<MenuItem key={c.slug} value={c.slug} style={getStyles(c.slug, selectedCat, theme)}>
									{c.slug}
								</MenuItem>
							))}
						</Select>
					</div>

					<div className={styles.rowGap}>
						<InputLabel id='demo-mutiple-chip-label' style={{ color: '#000000' }}>
							Tag *
						</InputLabel>
						<Select
							labelId='demo-mutiple-chip-label'
							id='demo-mutiple-chip'
							multiple
							name='tag'
							value={selectedTag}
							onChange={handleMultiDropDown}
							// open={openCat}
							// onClose={handleClose}
							input={<Input id='select-multiple-chip' />}
							renderValue={(selected) => (
								<div className={classes.chips}>
									{tags.map((value) => (
										<Chip key={value} label={value} className={classes.chip} />
									))}
								</div>
							)}
							style={{ color: '#000000' }}>
							{tags.map((c) => (
								<MenuItem key={c.slug} value={c.slug} style={getStyles(c.slug, selectedCat, theme)}>
									{c.slug}
								</MenuItem>
							))}
						</Select>
					</div>

					<div className={styles.textCenter}>
						<ColorButton variant='contained' color='primary' disabled={submitting} className={classes.buttonProps} type='submit'>
							Add Blog
						</ColorButton>
					</div>
				</form>
			</div>

			<div>
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
			</div>
		</div>
	);
}

async function getSignature(folderPath) {
	const response = await fetch(`/api/cloudinary/${folderPath}`);
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}
