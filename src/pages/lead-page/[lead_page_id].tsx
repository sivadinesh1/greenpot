import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Divider from '@material-ui/core/Divider';
import { forceLogout } from '../../components/auth/auth';
import { getCustomTempByNano } from '../../service/lead-page.service';
import styles from '../../styles/CustomTemp.module.scss';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Image from 'next/image';
import styles1 from '../../styles/Home.module.scss';
import Builder from '../../components/Builder';
import { ILeadPage } from '../../model/LeadPage'
import CustomForm from '../../components/DragTest'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const ColorButton = withStyles(() => ({
	root: {
		color: '#faf7f7',
		backgroundColor: '#3829E1',
		'&:hover': {
			backgroundColor: '#b1ace3',
		},
		padding: '0 20px',
	},
}))(Button);

const SectionButton = withStyles(() => ({
	root: {
		color: '#000000',
		backgroundColor: '#C4C4C4',
		'&:hover': {
			backgroundColor: '#b1ace3',
		},
		minWidth: '200px',
		minHeight: '40px',
		margin: '8px 0',
		padding: '0 20px',
	},
}))(Button);

export const getServerSideProps = async (context) => {
	let isError = false;
	let cookie = null;
	let cTempNano = null;
	let collection = null;

	try {
		cTempNano = context.params.lead_page_id;
		cookie = context?.req?.headers.cookie;
		collection = await getCustomTempByNano(cTempNano);
	} catch (error) {
		console.log(`error in custom template ${error}`);
		isError = true;
	}

	return {
		props: { isError, collection },
	};
};

const Collection = ({ isError, collection }) => {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);

	const [data, setData] = useState(collection.blocks);
	let objKeys = Object.keys(data);
	const [currentSection, setCurrentSection] = useState<ILeadPage>();
	const [fields, setFields] = useState([]);
	const [mode, setMode] = useState('view');
	const [currentKey, setCurrentKey] = useState();
	const [currentField, setCurrentField] = useState("");
	const [availableImages, setAvailableImages] = useState([]);

	// const [schedule, setSchedule] = useState([]);
	// const [loads, setLoads] = useState([]);
	// const [undo, setUndo] = useState([]);
	// const [redo, setRedo] = useState([]);

	//dynamically load initial value 
	let initialValTest = {};

	const setDefaultValue = async () => {
		await Promise.all(objKeys.map((key) => {
			data[key].blocks.map((data) => initialValTest[data.formDetail.name] = data.value)
		}))
		return initialValTest;
	}



	const {
		control,
		setValue,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm({ defaultValues: initialValTest });

	const onSubmit = async (formData) => console.log('form submit data test ---->', formData);

	// const handleUpdate = () => {
	// 	let oldObj = currentSection;
	// 	oldObj["blocks"][0].value = watch('company', oldObj.blocks[0].value.toString());
	// 	oldObj["blocks"][1].value = watch('blocks', oldObj.blocks[1].value.toString());
	// 	// oldObj["blocks"][0].value = watch('company');
	// 	// oldObj["blocks"][1].value = watch('blocks');
	// 	setLoads(loads.length > 0 ? [...loads, oldObj] : [oldObj]);
	// 	setUndo([...undo, oldObj]);
	// };

	// const undoChanges = () => {
	// 	const lastElement = undo[undo.length - 1];
	// 	console.log('check undo operation--->1', lastElement);
	// 	// Update redo to be able to rollback
	// 	setRedo([...undo]);
	// 	// Remove the last element from undo
	// 	undo.pop();
	// 	setCurrentSection(undo[undo.length - 1]);
	// 	// setUndo([...lastElement]);
	// };

	const [openDialog, setOpenDialog] = useState(false);
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const [uploadDialog, setUploadDialog] = useState(false);
	const handleOpenUpload = () => {
		setUploadDialog(true);
	};

	const handleCloseUpload = () => {
		setUploadDialog(false);
	};

	const handleMode = (mode) => {
		setMode(mode);
	};

	//segregate the image fields in blocks array
	const getFields = async (blocks) => {
		fields.length = 0;
		availableImages.length = 0;
		await Promise.all(
			blocks.map((data) => {
				fields.push(data.formDetail);
				// initialValTest[data.formDetail.name] = data.value;

				if (data.formDetail.type === 'image') handleAvailableImg(data.formDetail, data.value);
			}),
		);
	};

	//grouping image field and value in single object
	const handleAvailableImg = (field, value) => {
		let obj = {
			...field,
			value,
		};
		availableImages.push(obj);
	};

	const handleSection = async (key) => {
		let obj = data[key];
		console.log("check intermediate ---->", Object.keys(initialValTest).length)
		if (Object.keys(initialValTest).length === 0)
			setDefaultValue()
		setCurrentSection(obj);
		setCurrentKey(key);
		await getFields(obj.blocks);
		handleMode('edit');
	};

	const handleImage = async (name) => {
		setCurrentField(name);
		handleOpenUpload();
		handleCloseDialog();
		console.log('test current field', currentField);
	};

	//cloudinary
	const onDrop = useCallback(async (acceptedFiles) => {
		let path = `C${53}/B${101}/`;
		// await deleteOldImg(path);
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
			// setValue(currentField, data.secure_url);
			setValue('background', data.secure_url);
			console.log('check data --->', data);
			handleCloseUpload();
		});
	}, []);

	//drop zone
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: 'image/*',
		multiple: false,
	});

	const edit = () => {
		switch (currentKey) {
			case 'Header':
				if (currentSection?.status === 'Active')
					return (
						<Header
							company={watch('company', currentSection.blocks[0].value)}
							blocks={watch('content', currentSection.blocks[1].value)}
							imageUrl={watch('image', currentSection.blocks[2].value)}
							backgroundImage={watch('background', currentSection.blocks[3].value)}
						/>
					);
			case 'Footer':
				if (currentSection?.status === 'Active') return <Footer data={watch('footer', currentSection.blocks[0].value)} />;
		}
	};

	let formConfig = {
		id: "poster",
		label: "Poster",
		fields: [
			{
				name: "title",
				label: "Poster Title",
				component: "text",
			},
			{
				name: "subTitle",
				label: "Poster Sub Title",
				component: "text",
			},
			{
				name: "description",
				label: "Description",
				component: "text",
			}
			, {
				name: "profile",
				label: "Picture",
				component: "image",
			}, {
				name: "url",
				label: "test",
				component: "url",
			}
			// , {
			//     name: "test",
			//     label: "Picture 2",
			//     component: "image",
			// }

		],
		initialValues: {
			title: "Title Test",
			subTitle: "Test Sub title",
			description: "test description data ",
			profile: "https://res.cloudinary.com/sanjayaalam/image/upload/v1623844291/u1jyrnzzcitxj1jynh33.jpg",
			url: "https://aalamsoft.com/",
			test: "https://res.cloudinary.com/sanjayaalam/image/upload/v1630572962/C53/B101/xtkw46iuoadoclzwoedn.jpg"

		},
		onSubmit: async (formData) => {
			console.log("form submit data test ---->", formData);
		},
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<div className={styles.header_card}>
				{/* , justifyblocks: 'center' */}
				<div style={{ display: 'flex', alignItems: 'center' }}>{`${collection.repo.repo_name} / ${collection.lead_page_name}`}</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>Customize</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
						<div>&emsp;
							{/* <div style={{ float: 'left', cursor: 'pointer', paddingRight: '5px' }}>
								<Image src='/static/images/undo.svg' alt='edit' width='16px' height='16px' onClick={() => undoChanges()} />
							</div>
							<div style={{ float: 'left', padding: '0 10px' }}> | </div>
							<div style={{ float: 'left', cursor: 'pointer', paddingLeft: '5px' }}>
								<Image src='/static/images/redo.svg' alt='edit' width='16px' height='16px' onClick={() => undoChanges()} />
							</div> */}
						</div>
						<div>
							{' '}
							<ColorButton>Publish</ColorButton>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.wrapper}>
				{/* Editor Layer */}
				<div className={styles.left}>
					<div className={styles.section}>
						<div className={styles.top}>
							<div>
								{objKeys &&
									objKeys.map((key, index) => {
										return (
											<SectionButton key={index} onClick={() => handleSection(key)}>
												{key}
											</SectionButton>
										);
									})}
								<div className={styles.flex_end}>
									<ColorButton onClick={handleClick}>+ Add</ColorButton>
									<div>
										<Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} elevation={2} onClose={handleClose}>
											<MenuItem >
												{/* <Link href={`/admin/category`}> */}
												<a>Category</a>
												{/* </Link> */}
											</MenuItem>
										</Menu>
									</div>
								</div>
							</div>
						</div>

						<Divider style={{ background: '#000000' }} />
						<div className={styles.bottom}>
							<div>
								<form onSubmit={handleSubmit(onSubmit)}>
									{fields?.map((row, index) => {
										if (row.type === 'text') {
											return (
												<div className={styles.formGap} key={index} >
													<Controller
														name={row.name as any}
														key={index}
														control={control}
														rules={{ required: true }}
														render={({ field }) => (
															<TextField type='text' label={row.label} margin='dense' variant='standard' size='small' fullWidth {...field} />
														)}
													/>
												</div>
											);
										} else if (row.type === 'text-area') {
											return (
												<div className={styles.formGap} key={index} >
													<Controller
														name={row.name}
														key={index}
														control={control}
														rules={{ required: true }}
														render={({ field }) => (
															<TextField
																type='text'
																label={row.label}
																margin='dense'
																variant='standard'
																size='small'
																multiline
																rows={2}
																fullWidth
																{...field}
															/>
														)}
													/>
												</div>
											);
										}
									})}
								</form>
								{availableImages.length > 0 && <Button onClick={() => handleOpenDialog()}>Choose Image</Button>}
							</div>
						</div>
						<Divider style={{ background: '#000000' }} />
					</div>
				</div>
				{/* preview page */}
				<div className={styles.middle}>
					<div>
						{mode === 'view' && <Builder keySet={objKeys} data={data} mode={mode} />}

						{mode === 'edit' && edit()}
					</div>
					<div>
						<CustomForm formConfig={formConfig} />

					</div>
				</div>
				{/* style Layer */}
				<div className={styles.right}></div>
			</div>

			{/* image upload dialog model */}
			<div>
				<Dialog open={openDialog} onClose={handleCloseDialog}>
					<DialogContent style={{ width: '500px' }}>
						<div className={styles1.dialog_pop}>
							<div style={{ fontSize: '20px' }}>Choose Image</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseDialog} />
							</div>
						</div>
						<div>
							<div>
								{Array.from(new Set(availableImages.map((j) => j.label))).map((obj, index) => {
									return (
										<Button key={index} onClick={() => handleImage(obj.toString().toLowerCase())}>
											{obj}
										</Button>
									);
								})}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div>
				<Dialog fullScreen open={uploadDialog} onClose={handleCloseUpload}>
					<DialogContent>
						<div className={styles1.dialog_pop}>
							<div style={{ fontSize: '20px' }}>Image Upload</div>
							<div style={{ fontSize: '20px' }}>&emsp;</div>
							<div style={{ cursor: 'pointer' }}>
								<Image src='/static/images/close.svg' alt='edit' width='16px' height='16px' onClick={handleCloseUpload} />
							</div>
						</div>
						<div>
							<div>
								<div {...getRootProps()} className={`${styles1.dropzone} ${isDragActive ? styles1.active : null}`}>
									<input {...getInputProps()} />
									Drop Zone
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};

export default Collection;

async function getSignature(folderPath) {
	const response = await fetch(`/api/cloudinary/${folderPath}`);
	const data = await response.json();
	const { signature, timestamp } = data;
	return { signature, timestamp };
}

async function deleteOldImg(folderPath) {
	const requestOptions = {
		method: 'DELETE',
	};
	const response = await fetch(`/api/cloudinary/${folderPath}`, requestOptions);
	const data = await response.json();
	return data;
}
