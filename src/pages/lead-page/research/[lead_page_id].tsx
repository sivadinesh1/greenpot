import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useSnapshot } from 'valtio';
import Builder from '../../../components/Builder';
import { ILeadPage } from '../../../model/LeadPage';
import { getCustomTempByNano } from '../../../service/lead-page.service';
import styles_drop_zone from '../../../styles/dropZone.module.css';
import styles from '../../../styles/LeadPage.module.scss';
import { section } from '../../../utils/section';
import { Menu, MenuItem } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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

const LeadPage = ({ isError, collection }) => {
    const [data, setData] = useState(collection.blocks);
    let objKeys = Object.keys(data[0]);
    let fData = []
    data.map(section => {
        if (section.status === "InActive") {
            if (!fData.includes(section.type))
                fData.push(section.type)
        }
    })
    const [inActiveSection, setInActiveSection] = useState(fData.length > 0 ? [...fData] : [])

    console.log("check in active recorsd", inActiveSection)
    const [reload, setReload] = useState(false);
    const section_data = useSnapshot(section);
    const [fields, setFields] = useState([]);
    const [currentIndex, setCurrentIndex] = useState('0');
    const [anchorEl, setAnchorEl] = React.useState(null);

    // const {
    // 	control,
    // 	setValue,
    // 	handleSubmit,
    // 	watch,
    // 	formState: { errors },
    // } = useForm();

    const [content, setContent] = useState(data[0].items[0].value);
    const [position, setPosition] = useState('0');
    const [contentType, setContentType] = useState('text');
    const [mode, setMode] = useState(section_data.currentSection === null ? 'view' : 'edit');
    const [snack, setSnack] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    useEffect(() => {
        console.log('check valtio data--->', section_data);
        if (section_data.isEdit) {
            handleSection(section_data.currentSection.sectionIndex);
        } else if (section_data.mode !== '') {
            debugger;
            setMode('view');
            if (section_data.mode === 'delete') handleSectionDelete();
            else if (section_data.mode === 'duplicate') handleSectionDuplicate();
        }
    }, [section_data.currentSection, section_data.mode]);

    const handleSectionDuplicate = () => {
        debugger;
        let cloneData = data.map(d => { return { ...d } });
        let newSection = { ...cloneData[section_data.currentSection.sectionIndex] }
        let index = section_data.currentSection.sectionIndex;

        if (!newSection.isDelete) {
            newSection.isDelete = true
        }
        cloneData.splice((index + 1), 0, newSection);
        setData(cloneData);
        setReload(!reload);
        console.log("cross check in duplicate----->", cloneData)
        setSnack(true);
        setMessage('Section Cloned successfully');
        // handleSaveBlock();
        section["mode"] = ""
    };

    const handleSectionDelete = () => {
        debugger;
        let index = section_data.currentSection.sectionIndex;
        let cloneData = data.map(d => { return { ...d } });
        console.log("cross check test 1----->", cloneData)
        if (!cloneData[section_data.currentSection.sectionIndex].isDelete) {
            cloneData[index].status = 'InActive';
            if (!inActiveSection.includes(cloneData[section_data.currentSection.sectionIndex].type))
                inActiveSection.push(cloneData[section_data.currentSection.sectionIndex].type)
        } else {
            cloneData.splice(index, 1);
        }
        console.log("cross check test 2----->", cloneData)

        setData(cloneData);
        setReload(!reload);
        setSnack(true);
        setMessage('Section Deleted successfully');
        // handleSaveBlock();
        section["mode"] = ""
    };

    const handleUpdateDeletedSection = (sectionName, index) => {
        let cloneData = data.map(d => {
            if (sectionName === d.type) {
                inActiveSection.splice(index, 1)
                return { ...d, status: "Active" }
            }
            else
                return { ...d }
        });
        setData(cloneData);
        setReload(!reload);
        setAnchorEl(null);
        handleSaveBlock();
    }
    const onChangeContent = (val, pos, index, type) => {
        debugger;
        console.log('check onchange method--->' + val + '  ' + pos + '  ' + index + '  ' + type);
        setContent(val);
        setCurrentIndex(index)
        setPosition(pos);
        setContentType(type);
    };

    const handleChange = (val) => {
        debugger;
        setContent(val);
        let cloneData = data;
        cloneData[currentIndex].items[position].value = val;
        setData(cloneData);
        console.log('check after Change--->3', cloneData);
        handleSaveBlock();
    };

    const [formValues, setFormValues] = useState({});
    const getFields = async (blocks) => {
        fields.length = 0;
        let dynamicFormValue = {};
        await Promise.all(
            blocks.map((data) => {
                dynamicFormValue[data.formDetail.name] = data.value;
                fields.push(data.formDetail);
            }),
        );
        console.log('check form default value----->', dynamicFormValue);
        setFormValues(dynamicFormValue);
        debugger;
    };

    const handleSection = async (index) => {
        debugger
        let obj = data[index];
        // setCurrentSection(obj);
        setCurrentIndex(index)
        await getFields(obj.items);
        setMode('edit');
    };

    const handleSaveBlock = async () => {
        let request = {
            id: collection.id,
            block: data,
        };
        let result = await axios.put('/api/lead-page/updateBlock', request);
        console.log('check result set--->', result);
    };

    const handleSectionForm = (event, index, subIndex) => {
        setFormValues({ ...formValues, [event.target.name]: event.target.value });
        let cloneData = data;
        cloneData[index].items[subIndex].value = event.target.value;
        setData(cloneData);
        handleSaveBlock();
    };

    //cloudinary
    const onDrop = useCallback(async (acceptedFiles) => {
        let path = `L${1005}/B${10}/`;
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
            debugger;
            handleChange(data.secure_url);
        });
    }, []);

    //drop zone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });

    const sectionDetail = () => {
        debugger;
        return (
            <div style={{ paddingTop: '40px' }}>
                <div onClick={() => setMode('view')} style={{ paddingBottom: '20px' }}>
                    <KeyboardBackspaceIcon />
                </div>
                {fields?.map((row, index) => {
                    if (row.type === 'text') {
                        return (
                            <div className={styles.formGap} style={{ padding: '5px' }} key={index}>
                                <TextField
                                    name={row.name}
                                    type='text'
                                    label={row.label}
                                    id='outlined-multiline-static'
                                    onChange={(e) => handleSectionForm(e, currentIndex, index)}
                                    margin='dense'
                                    variant='outlined'
                                    size='small'
                                    multiline
                                    rows={4}
                                    value={formValues[row.name]}
                                    fullWidth
                                />
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div>
                        <Builder keySet={objKeys} data={data} mode={'view'} onHandleChange={onChangeContent} />
                    </div>
                </div>

                <div className={styles.right}>
                    {mode === 'view' && (
                        <div>
                            <div className={styles.flex_end} style={{ paddingTop: '40px' }}>
                                {inActiveSection.length > 0 && <div>
                                    <ColorButton onClick={(event) => handleClick(event)}> + Section</ColorButton>
                                    <Menu
                                        id='simple-menu'
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        elevation={2}
                                        onClose={handleClose}>
                                        {/* {Array.from(new Set(inActiveSection)).map((d, index) => { */}
                                        {inActiveSection.map((d, index) => {
                                            return (<MenuItem onClick={() => handleUpdateDeletedSection(d, index)}>{d} </MenuItem>)
                                        })}
                                    </Menu>
                                </div>}
                            </div>
                            <div style={{ paddingTop: '10px' }}>
                                <TextField
                                    name='content'
                                    type='text'
                                    label={contentType === 'image' ? 'Source' : 'Text/Html'}
                                    margin='dense'
                                    variant='outlined'
                                    size='small'
                                    value={content}
                                    onChange={(e) => handleChange(e.target.value)}
                                    multiline
                                    rows={5}
                                    fullWidth
                                />
                            </div>
                            {contentType === 'image' && (
                                <div style={{ paddingTop: '10px' }}>
                                    <div className={styles.drop_zone}>
                                        <div
                                            {...getRootProps()}
                                            className={`${styles_drop_zone.drop_zone} ${isDragActive ? styles_drop_zone.active : null}`}>
                                            <input {...getInputProps()} />
                                            {`Upload an Image`}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {mode === 'edit' && sectionDetail()}
                </div>
            </div>
            <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
                <MuiAlert elevation={6} onClose={() => setSnack(false)} variant='filled'>
                    {message}
                </MuiAlert>
            </Snackbar>
        </div>

    );
};

export default LeadPage;

async function getSignature(folderPath) {
    const response = await fetch(`/api/cloudinary/${folderPath}`);
    const data = await response.json();
    const { signature, timestamp } = data;
    return { signature, timestamp };
}
