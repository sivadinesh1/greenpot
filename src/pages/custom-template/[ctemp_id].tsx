import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Divider from '@material-ui/core/Divider';
import { forceLogout } from '../../components/auth/auth';
import { getCustomTempByNano } from "../../service/customTemp.service";
import styles from '../../styles/CustomTemp.module.scss';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Image from 'next/image';
import styles1 from '../../styles/Home.module.scss';





const ColorButton = withStyles(() => ({
    root: {
        color: '#faf7f7',
        backgroundColor: '#3829E1',
        '&:hover': {
            backgroundColor: '#b1ace3',
        },
        padding: '0 20px'
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
        padding: '0 20px'
    },
}))(Button);

export const getServerSideProps = async (context) => {
    let isError = false;
    let cookie = null;
    let cTempNano = null;
    let customTemp = null;

    try {
        cTempNano = context.params.ctemp_id;
        cookie = context?.req?.headers.cookie;
        customTemp = await getCustomTempByNano(cTempNano);

    } catch (error) {
        console.log(`error in custom template ${error}`);
        isError = true;
    }

    return {
        props: { isError, customTemp },
    };
}

const CustomTemp = ({ isError, customTemp }) => {
    useEffect(() => {
        if (isError) {
            return forceLogout();
        }
    }, []);

    const [data, setData] = useState(customTemp.content);
    let objKeys = Object.keys(data);
    const [currentSection, setCurrentSection] = useState();
    const [fields, setFields] = useState([]);
    const [mode, setMode] = useState("view");
    const [currentKey, setCurrentKey] = useState();
    const [currentField, setCurrentField] = useState();
    const [availableImages, setAvailableImages] = useState([]);


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
        setMode(mode)
    }
    let initialValTest = {};

    const getFields = async (content) => {
        fields.length = 0
        availableImages.length = 0
        await Promise.all(content.map((data) => {
            fields.push(data.formDetail)
            initialValTest[data.formDetail.name] = data.value

            if (data.formDetail.type === 'image')
                handleAvailableImg(data.formDetail, data.value);
        }))
    }

    const handleAvailableImg = (field, value) => {
        let obj = {
            ...field,
            value
        }
        availableImages.push(obj);
    }
    const handleSection = async (key) => {
        let obj = data[key];
        setCurrentSection(obj);
        setCurrentKey(key);
        await getFields(obj.content);
        handleMode("edit");
    }

    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: initialValTest });

    const onSubmit = async (formData) => console.log("form submit data test ---->", formData);


    const handleImage = async (name) => {
        console.log("test handle image method call", name)
        await setCurrentField(name);
        handleOpenUpload();
        handleCloseDialog();
        console.log("test current field", currentField)

    }

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
            console.log("check data --->", currentField)
            setValue(currentField, data.secure_url)
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
                if (currentSection.status === 'Active')
                    return (<Header content={watch('content', currentSection.content[1].value)} company={watch('company', currentSection.content[0].value)} imageUrl={watch('image', currentSection.content[2].value)} backgroundImage={watch('background', currentSection.content[3].value)} />)
            case 'Footer':
                if (currentSection.status === 'Active')
                    return (<Footer data={watch('footer', currentSection.content[0].value)} />)
        }
    }

    return (<>
        <div className={styles.header_card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {`${customTemp.repo.name} / ${customTemp.name}`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Customize
        </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ColorButton>Publish</ColorButton>
            </div>
        </div>
        <div className={styles.wrapper}>
            {/* Editor Layer */}
            <div className={styles.left}>

                <div className={styles.section}>
                    <div className={styles.top}>
                        <div>
                            {objKeys && objKeys.map((key, index) => {
                                return (
                                    <SectionButton key={index} onClick={() => handleSection(key)}>{key}</SectionButton>
                                )
                            })}
                        </div>
                    </div>
                    <Divider style={{ background: '#000000' }} />
                    <div className={styles.bottom}>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {fields?.map((row, index) => {
                                    if (row.type === 'text') {
                                        return (
                                            <div className={styles.formGap} key={index}>
                                                <Controller
                                                    name={row.name}
                                                    key={index}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField type='text' label={row.label} margin='dense' variant='standard' size='small' fullWidth {...field} />
                                                    )}
                                                />
                                            </div>
                                        );
                                    }
                                    else if (row.type === 'text-area') {
                                        return (
                                            <div className={styles.formGap} key={index}>
                                                <Controller
                                                    name={row.name}
                                                    key={index}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField type='text' label={row.label} margin='dense' variant='standard' size='small' multiline rows={2} fullWidth {...field} />
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

                    {mode === "view" && objKeys.map((key) => {
                        let obj = null;
                        switch (key) {
                            case 'Header':
                                obj = data.Header
                                if (obj.status === 'Active')
                                    return (<Header
                                        company={obj.content[0].value}
                                        content={obj.content[1].value}
                                        imageUrl={obj.content[2].value}
                                        backgroundImage={obj.content[3].value} />)
                            case 'Footer':
                                obj = data['Footer']
                                if (obj.status === 'Active')
                                    return (<Footer data={obj.content[0].value} />)

                        }
                    })}

                    {mode === "edit" && edit()}
                </div>
            </div>
            {/* style Layer */}
            <div className={styles.right}>

            </div>
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

                                return (<Button key={index} onClick={() => handleImage(obj.toString().toLowerCase())}>{obj}</Button>)
                            })}
                        </div>
                    </div>

                </DialogContent>
            </Dialog>
        </div>

        <div>
            <Dialog fullScreen open={uploadDialog} onClose={handleCloseUpload}>
                <DialogContent >
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
    </>)

}

export default CustomTemp;

async function getSignature(folderPath) {
    const response = await fetch(`/api/cloudinary/${folderPath}`);
    const data = await response.json();
    const { signature, timestamp } = data;
    return { signature, timestamp };
}

async function deleteOldImg(folderPath) {
    const requestOptions = {
        method: 'DELETE'
    };
    const response = await fetch(`/api/cloudinary/${folderPath}`, requestOptions);
    const data = await response.json();
    return data;
}

// function getUnique(arr, index) {

//     const unique = arr
//         .map(e => e[index])

//         .map((e, i, final) => final.indexOf(e) === i && i)

//         .filter(e => arr[e]).map(e => arr[e]);

//     return unique;
// }