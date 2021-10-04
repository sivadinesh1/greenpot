import React, { useRef, useCallback, useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import { Button, Divider, Menu, MenuItem, withWidth } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import { Image } from 'cloudinary-react';

import { useDropzone } from 'react-dropzone';

import styles from '../../../../styles/Blog.module.scss';

import styles_drop_zone from '../../../../styles/dropZone.module.css';

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
import { FormInputDate } from '../../../../components/forms/FormInputDate';
import ImageNext from 'next/image';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import AdbIcon from '@mui/icons-material/Adb';
import DeleteDialog from '../../../../components/elements/ui/Dialog/DeleteDialog';
import DeleteIcon from '@mui/icons-material/Delete';



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

		//fetch uploaded images
		path = `C${user?.data?.company_id}/B${blog.id}`;
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

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [imageFile, setImageFile] = useState<any>();
	const [currentBlog, setCurrentBlog] = useState<any>(blog);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const setThumbnail = async () => {
		let request = {
			id: currentBlog.id,
			thumbnail: imageFile.url
		}

		let resp = await axios.put(`/api/blog/updateThumb`, request);
		console.log("test response thumbail 2--->", resp);
		if (resp.status === 200) {
			setCurrentBlog(resp.data)
			setAnchorEl(null);
		}
	}

	const preloadedValues = {
		title: blog.title.startsWith('Untitled') ? '' : blog.title,
		description: blog.description,
		author: blog.author,
		thumbnail: blog.thumbnail,
		layout: blog.layout,
		slug: blog.slug,
		is_author: blog.is_author,
		is_publish_date: blog.is_publish_date
	};
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const uploadLimit = 10;

	const [uploadedFiles, setUploadedFiles] = useState(selectedImages?.length > 0 ? selectedImages : []);

	const [selectedTags, setSelectedTags] = useState([...selectedTag]);
	console.log('test pre selected values--->', selectedTag);
	const [selectedCategorys, setSelectedCategorys] = useState([...selectedCat]);
	const [showAssets, setShowAssets] = useState(false);
	const [showApps, setShowApps] = useState(false);

	const [showMetaSection, setShowMetaSection] = useState(false);
	const [showLayout, setShowLayout] = useState(false)

	let schema = yup.object().shape({
		title: yup.string().required('Title is required').min(3).max(72),
		description: yup.string().required('Description is required').max(200),
		author: yup.string().required('Author is required').max(50),
		categories: yup.string().nullable().notRequired(),
		tags: yup.string().nullable().notRequired(),
		company_id: yup.string().nullable().notRequired(),
		slug: yup.string().nullable().notRequired(),
		layout: yup.string().nullable().notRequired(),
		thumbnail: yup.string().nullable().notRequired(),
		is_author: yup.boolean().nullable().notRequired(),
		is_publish_date: yup.boolean().nullable().notRequired(),
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

	const handleShowAssets = () => {
		setShowAssets(!showAssets);
		setShowMetaSection(false);
		setShowApps(false);
	};

	const handleShowApps = () => {
		setShowApps(!showApps);
		setShowAssets(false);
		setShowMetaSection(false);
	};

	const handleShowMetaSection = () => {
		setShowMetaSection(!showMetaSection);
		setShowAssets(false);
		setShowLayout(false)
	};
	const handleShowLayout = () => {
		setShowLayout(!showLayout)
		setShowMetaSection(false);
		setShowAssets(false);
	}

	const handleClick = (event, item) => {
		setAnchorEl(event.currentTarget);
		setImageFile(item);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};
	const snap = useSnapshot(content);

	const handleView = () => {
		Router.push(`/admin/blog/${blog.blog_id}`)
	}

	const onSubmit = async (formData, event) => {
		console.log('check form data ---->', formData);
		if (submitting) {
			return false;
		}
		if (!selectedTags.length || !selectedCategorys.length) {
			setIsError1(true);
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
			blogDate: parseISO(selectedDate),
			categories: uniqCategorys,
			tag: uniqTags,
			company_id: company_id,
			status: status,
			createdAt: blog.published_on,
			thumbnail: formData.thumbnail,
			is_publish_date: formData.is_publish_date,
			is_author: formData.is_author
		};
		if (snap.obj != null) values['content'] = snap.obj;
		console.log('test values data---->', values);

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
		// setAnchorEl(null);
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


	var layoutarray = [
		{
			label: "classic",
			icon: AdUnitsIcon
		},
		{
			label: "classic pro",
			icon: AdbIcon
		}
		, {
			label: "layout3",
			icon: AdbIcon
		},
		// {
		// 	label: "layout4",
		// 	icon: AdbIcon
		// }, {
		// 	label: "layout5",
		// 	icon: AdbIcon
		// },
		// {
		// 	label: "layout6",
		// 	icon: AdbIcon
		// }
	]

	const initialArray = (data) => {
		var initialGroup = {}
		data.map((layout) => {
			initialGroup[layout.label] = false;
		});
		return initialGroup;
	}

	let group = initialArray(layoutarray);
	let initialGroup = { ...group }

	initialGroup[blog.layout.toString().toLowerCase().replace("_", " ")] = true
	const [layoutGroup, setLayoutGroup] = useState(initialGroup);

	const handleLayout = async (event) => {
		setLayoutGroup({ ...group, [event.target.name]: true })
		let request = {
			id: currentBlog.id,
			layout: event.target.name.toString().toLowerCase().replace(" ", "_")
		}
		let resp = await axios.put(`/api/blog/updateLayout`, request);
		if (resp.status === 200) {
			setCurrentBlog(resp.data)
		}
	};

	//layout option 
	const chooseLayout = () => {

		return (
			<div className={styles.layout_list}>
				{Object.keys(layoutGroup).map((key, index) => (
					<div className={styles.layout}>
						<Checkbox
							checked={layoutGroup[key]}
							onChange={handleLayout}
							inputProps={{ 'aria-label': 'controlled' }}
							name={key}
							icon={<AdbIcon />}
							checkedIcon={<AdbIcon />}
						// label="test"
						/>
						<div className={styles.layout_title}>{key}</div> </div>

				))}
			</div>
		);

	}

	// delete option 
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const handleOpenDeleteDialog = () => {
		setOpenDeleteDialog(true);
	};

	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
	};
	const confirmDelete = async () => {
		let response = await axios.delete(`/api/blog/${currentBlog.id}`);
		if (response.status === 200) {
			Router.push(`/dashboard`);
			handleCloseDeleteDialog();
		}
		//mutate();
	};
	return (
		<>
			<div className={styles.main_menu}>
				<div onClick={handleShowAssets} className={styles.menu_item}>
					<Image src='/static/images/gallery.svg' alt='gallery' width='32px' height='32px' />
				</div>
				<div onClick={handleShowApps} className={styles.menu_item}>
					<Image src='/static/images/apps.svg' alt='apps' width='32px' height='32px' />
				</div>
			</div>
			<div className={styles.main_bg}>
				<div className={showAssets ? `${styles.assets} ${styles.show_assets}` : `${styles.assets}`}>
					<div className={styles.drop_zone}>
						<div {...getRootProps()} className={`${styles_drop_zone.drop_zone} ${isDragActive ? styles_drop_zone.active : null}`}>
							<input {...getInputProps()} />
							Drag'n'drop files, or click to select files
						</div>
						{/* {uploadedFiles.length === uploadLimit && <p style={errorStyle}>upload Limit {uploadLimit}</p>}
						 */}
					</div>

					<div className={styles.no_image}>
						{uploadedFiles.length === 0 && (
							<>
								<div>No Images</div>
							</>
						)}

						{uploadedFiles.length > 0 && (
							<>
								<div style={{ display: 'grid', padding: '6px 6px', gridTemplateColumns: '1fr 1fr', margin: 'auto auto' }}>
									{uploadedFiles.map((file) => (
										<div key={file.public_id} className={styles.image_item}>
											<div className={styles.item_dots} onClick={(event) => handleClick(event, file)}>
												<Image src='/static/images/down-arrow.svg' alt='edit' width='12px' height='12px' />
											</div>

											<Image
												cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
												publicId={file.public_id}
												width='100'
												height='100'
												crop='scale'
											/>
										</div>
									))}
								</div>
							</>
						)}
					</div>
				</div>
				<div className={showApps ? `${styles.apps} ${styles.show_apps}` : `${styles.apps}`}>
					<div className={styles.drop_zone}>Apps !!!!!!!</div>
				</div>
				<div className={styles.blog_wrap}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.action_bar}>
							<div className={styles.filler}>&nbsp;</div>
							<Button onClick={() => handleView()} variant='contained' color='primary' style={{ marginLeft: '10px' }}>
								view
							</Button>
							<Button variant='contained' color='primary' style={{ marginLeft: '10px' }}>
								clear
							</Button>
							{accessRights != 'W' && (
								<Button variant='contained' color='primary' type='submit' id='publish' style={{ marginLeft: '10px' }}>
									Publish
							</Button>
							)}
						</div>
						<div>
							<div>
								{MyEditor && <MyEditor data={blog.content == null ? undefined : blog.content} blogId={blog.id} />}
								{/* </form> */}
							</div>

							<div>
								<Dialog
									maxWidth='xl'
									open={openDialog}
									onClose={handleCloseDialog}
									aria-labelledby='max-width-dialog-title'>
									<DialogTitle id='customized-dialog-title'>Media Gallery</DialogTitle>
									<DialogContent dividers>
										<div className={styles.no_image}>
											{uploadedFiles.length === 0 && (
												<>
													<div>No Images</div>
												</>
											)}

											{uploadedFiles.length > 0 && (
												<div style={{ display: 'grid', padding: '6px 6px 6px', gridTemplateColumns: '1fr 1fr 1fr', margin: 'auto auto auto' }}>
													{uploadedFiles.map((file) => (
														<div key={file.public_id} className={styles.image_item}>
															<div className={styles.item_dots} onClick={(event) => handleClick(event, file)}>
																<Image src='/static/images/down-arrow.svg' alt='edit' width='12px' height='12px' />
															</div>

															<Image
																cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
																publicId={file.public_id}
																width='100'
																height='100'
																crop='scale'
															/>
														</div>
													))}
												</div>
											)}
										</div>
										<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
											<MenuItem onClick={() => setThumbnail()}>Set as thumbnail</MenuItem>
											<MenuItem onClick={handleClose}>
												<CopyToClipboard text={imageFile?.url} onCopy={() => setCopy(true)}>
													<Button>Copy url</Button>
												</CopyToClipboard>
											</MenuItem>
										</Menu>

									</DialogContent>
									<DialogActions>
										<Button onClick={handleCloseDialog} color='primary'>
											Back
									</Button>
									</DialogActions>
								</Dialog>
							</div>
						</div>
					</form>
				</div>
				<div className={showMetaSection ? `${styles.r_normal}` : `${styles.r_hidden}`}>
					<div>META DATA</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.rowGap}>
							<FormInputText name='title' control={control} label='SEO Blog Title' variant='standard' />
						</div>
						<div className={styles.rowGap}>
							<FormInputText name='slug' control={control} label='Slug' variant='standard' />
						</div>
						<div className={styles.rowGap}>
							<FormInputText name='description' control={control} label='SEO Blog Description' variant='standard' />
						</div>
						<div className={styles.rowGap}>
							<InputLabel style={{ fontSize: '12px', marginBottom: '5px' }}>Feature Image</InputLabel>
							<div className={styles.article_thumbnail}>
								<div className={styles.image}><ImageNext src={currentBlog.thumbnail} width={"150px"} height={"150px"} /></div>
							</div>
							<div className={styles.flex_end}><Button onClick={handleOpenDialog} color='primary'>On Change</Button></div>
						</div>
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
						<div className={styles.rowGap}>
							<FormInputDropdown
								name='author'
								control={control}
								width={'100%'}
								defaultValue={{ label: '', value: '' }}
								label='Select Author'>
								{authors.map((author, index) => (
									<MenuItem key={index} value={author.first_name}>
										{author.first_name}
									</MenuItem>
								))}
							</FormInputDropdown>
						</div>
						{/* <div className={styles.rowGap}>
							<FormInputDropdown
								name='layout'
								control={control}
								width={'100%'}
								defaultValue={{ label: '', value: '' }}
								label='Select Layout'>
								{options.map((option: any) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</FormInputDropdown>
						</div> */}
						<div className={styles.rowGap}>
							<InputLabel style={{ fontSize: '12px', marginBottom: '5px' }}>By Line</InputLabel>
							<div className={styles.blog_switch}>
								{/* <div>
									<FormControlLabel
										value="end"
										control={<Switch color="primary" />}
										label="Date Edited"
										labelPlacement="end"
									/>
								</div> */}

								<div>
									<div className={styles.flex_center}>
										<div><Controller name='is_author' control={control} render={({ field }) => <Switch {...field} />} /></div>
										<div style={{ paddingTop: '5px' }}>Show author </div>
									</div>
								</div>
								<div>
									<div className={styles.flex_center}>
										<div><Controller name='is_publish_date' control={control} render={({ field }) => <Switch {...field} />} /></div>
										<div style={{ paddingTop: '5px' }}>Date published </div>
									</div>
								</div>
								<div>
									<div className={styles.flex_center}>
										<div><Controller control={control} name='someName' render={({ field }) => <Switch disabled {...field} />} /></div>
										<div style={{ paddingTop: '5px' }}>Date edited </div>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.flex_center}>
							<Button variant='contained' color='primary' type='submit' id='save' style={{ marginRight: '10px' }}>
								Save</Button>
						</div>
					</form>
				</div>
				<div className={showLayout ? `${styles.r_normal}` : `${styles.r_hidden}`}>
					<div>Test Layout</div>
					{chooseLayout()}
					<br />
					<Divider />
					<div>Action</div>
					<Divider />
					<div onClick={() => handleOpenDeleteDialog()} className={styles.blog_delete}>
						<DeleteIcon /> Move to Trash
					</div>
				</div>
			</div>
			<div className={showMetaSection ? `${styles.right_side_menu_expand}` : `${styles.right_side_menu}`}>
				<div onClick={handleShowMetaSection} className={styles.menu_item}>
					<Image src='/static/images/form.svg' alt='edit' width='30px' height='30px' />
				</div>
				<div onClick={handleShowLayout} className={styles.menu_item}>
					<Image src='/static/images/layout.svg' alt='edit' width='30px' height='30px' />
				</div>
			</div>

			{openDeleteDialog && (
				<DeleteDialog
					open={openDeleteDialog}
					handleClose={handleCloseDeleteDialog}
					windowTitle='Delete this article?'
					deleteMessage='It will be un-published and deleted and wont be able to recover it.'
					title={currentBlog?.title}
					confirmDelete={confirmDelete}
				/>
			)}

			<Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
				<MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
					{message}
				</MuiAlert>
			</Snackbar>
			<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
				<MenuItem onClick={() => setThumbnail()}>Set as thumbnail</MenuItem>
				<MenuItem onClick={handleClose}>
					<CopyToClipboard text={imageFile?.url} onCopy={() => setCopy(true)}>
						<Button>Copy url</Button>
					</CopyToClipboard>
				</MenuItem>

				<Divider />
				<MenuItem onClick={() => removeImage(imageFile)}>
					<span style={{ color: 'red', fontSize: '12px' }}>Delete</span>
				</MenuItem>
			</Menu>
		</>
	);
}

async function getSignature(folderPath) {
	const response = await fetch(`/api/cloudinary/${folderPath}`);
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}
