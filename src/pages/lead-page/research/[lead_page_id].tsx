import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Router from 'next/router';
import Divider from '@material-ui/core/Divider';
import { getCustomTempByNano } from '../../../service/lead-page.service';
import styles from '../../../styles/LeadPage.module.scss';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Header from '../../../components/landing/Header';
import Footer from '../../../components/landing/Footer';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDropzone } from 'react-dropzone';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Image from 'next/image';
import styles1 from '../../../styles/Home.module.scss';
import Builder from '../../../components/Builder';
import { ILeadPage } from '../../../model/LeadPage'
import CustomForm from '../../../components/DragTest'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { section } from '../../../utils/section';
import { useSnapshot } from 'valtio';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import styles_drop_zone from '../../../styles/dropZone.module.css';


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

// function useForceUpdate(){
//     const [value, setValue] = useState(0); // integer state
//     return () => setValue(value => value + 1); // update the state to force render
// }

const LeadPage = ({ isError, collection }) => {
    const [data, setData] = useState(collection.blocks);
    let objKeys = Object.keys(data);
    console.log("check lead page name------>", data)
    const [reload, setReload] = useState(false)
    const section_data = useSnapshot(section);
    const [currentSection, setCurrentSection] = useState<ILeadPage>();
    const [currentKey, setCurrentKey] = useState();
    const [fields, setFields] = useState([]);


    const {
        control,
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();


    const [content, setContent] = useState(data["Header"].blocks[0].value)
    const [key, setKey] = useState("Header")
    const [position, setPosition] = useState("0");
    const [contentType, setContentType] = useState("text")
    const [mode, setMode] = useState(section_data.currentSection === null ? "view" : "edit")
    console.log("check mode ----->data 6", section_data.currentSection)

    useEffect(() => {
        debugger;
        console.log("check valtio data--->", section_data)
        if (section_data.isEdit) {
            handleSection(section_data.currentSection.sectionName)
        } else if (section_data.mode !== "") {
            setMode("view")
            if (section_data.mode === "delete")
                handleSectionDelete()
            else if (section_data.mode === "duplicate")
                handleSectionDuplicate();
        }
    }, [section_data.currentSection, section_data.mode]);

    const handleSectionDuplicate = () => {
        debugger
        let test = data;
        test[`${section_data.currentSection.sectionName}-${objKeys.length}`] = test[section_data.currentSection.sectionName]
        console.log("check dulicate data----->2", test);
        setData(test)
        setReload(!reload)
    }

    const handleSectionDelete = () => {
        debugger
        let test = data;
        test[section_data.currentSection.sectionName].status = "InActive"
        // useCallback(() => setData(test), []);
        setData(test)
        setReload(!reload)

    }


    const onChangeContent = (val, pos, key, type) => {
        debugger
        console.log("check onchange method--->" + val + "  " + pos + "  " + key + "  " + type)
        setContent(val);
        setKey(key);
        setPosition(pos);
        setContentType(type)

        // setData(test)
    }

    const handleChange = (val) => {
        debugger
        setContent(val);
        let test = data;
        test[key].blocks[position].value = val;
        setData(test)
        console.log("check after Change--->3", test)
        handleSaveBlock();
    }

    const [formValues, setFormValues] = useState({});
    const getFields = async (blocks) => {
        fields.length = 0;
        let dynamicFormValue = {};
        await Promise.all(
            blocks.map((data) => {
                dynamicFormValue[data.formDetail.name] = data.value
                fields.push(data.formDetail);
            })
        );
        console.log("check form default value----->", dynamicFormValue)
        setFormValues(dynamicFormValue)
        debugger
    };

    const handleSection = async (key) => {
        let obj = data[key];
        setCurrentSection(obj);
        setCurrentKey(key);
        await getFields(obj.blocks);
        setMode("edit")
        debugger
    };

    const handleSaveBlock = async () => {
        let request = {
            id: collection.id,
            block: data
        }
        let result = await axios.put('/api/lead-page/updateBlock', request)
        console.log("check result set--->", result)
    }

    const handleSectionForm = (event, key, pos) => {
        setFormValues({ ...formValues, [event.target.name]: event.target.value })
        let test = data;
        test[key].blocks[pos].value = event.target.value;
        setData(test)
        handleSaveBlock();
    }

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
            debugger
            handleChange(data.secure_url);
        });
    }, []);



    //drop zone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    const sectionDetail = () => {
        debugger
        console.log("check mode ---->", mode);
        console.log("check field array----->", fields);
        return (<div style={{ paddingTop: "40px" }}>
            <div onClick={() => setMode("view")} style={{ paddingBottom: "20px" }}><KeyboardBackspaceIcon /></div>
            {fields?.map((row, index) => {
                if (row.type === 'text') {
                    return (
                        <div className={styles.formGap} style={{ padding: "5px" }} key={index} >
                            <TextField
                                name={row.name}
                                type='text'
                                label={row.label}
                                id="outlined-multiline-static"
                                onChange={(e) => handleSectionForm(e, currentKey, index)}
                                margin='dense'
                                variant="outlined"
                                size='small'
                                multiline
                                rows={4}
                                value={formValues[row.name]}
                                fullWidth />
                            {/* <TextareaAutosize
                                name={row.name}
                                id="outlined-multiline-static"
                                onChange={(e) => handleSectionForm(e, currentKey, index)}
                                rows={4}
                                value={formValues[row.name]}
                                style={{ width: "100%" }} /> */}

                        </div>
                    );
                }

            })}
        </div>)
    }

    return (<div>

        <div className={styles.container}>
            <div className={styles.left}>
                <div>
                    <Builder keySet={objKeys} data={data} mode={"view"} onHandleChange={onChangeContent} />
                </div>
            </div>

            <div className={styles.right}>
                {mode === "view" && <div>
                    <div style={{ paddingTop: "40px" }}>
                        <TextField
                            name="content"
                            type='text'
                            label={contentType === "image" ? "Source" : "Text/Html"}
                            margin='dense'
                            variant="outlined"
                            size='small'
                            value={content}
                            onChange={(e) => handleChange(e.target.value)}
                            multiline
                            rows={5}
                            fullWidth
                        />
                    </div>
                    {contentType === "image" && <div style={{ paddingTop: "10px" }}>
                        <div className={styles.drop_zone}>
                            <div {...getRootProps()} className={`${styles_drop_zone.drop_zone} ${isDragActive ? styles_drop_zone.active : null}`}>
                                <input {...getInputProps()} />
                                {`Upload an Image`}
                            </div>
                        </div>
                    </div>}
                </div>
                }
                {mode === "edit" && sectionDetail()}


            </div>
        </div>
    </div>)
}

export default LeadPage;



async function getSignature(folderPath) {
    const response = await fetch(`/api/cloudinary/${folderPath}`);
    const data = await response.json();
    const { signature, timestamp } = data;
    return { signature, timestamp };
}