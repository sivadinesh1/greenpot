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
import { HexColorPicker, HexColorInput, } from "react-colorful";
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'


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
    // let objKeys = Object.keys(data[0]);
    let fData = [];
    data.map((section) => {
        if (section.status === 'InActive') {
            if (!fData.includes(section.type)) fData.push(section.type);
        }
    });
    const [inActiveSection, setInActiveSection] = useState(fData.length > 0 ? [...fData] : []);

    console.log('check in active recorsd', inActiveSection);
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
    const [color, setColor] = useState("#aabbcc");
    const [backGroundColor, setBackgroundColor] = useState({
        displayColorPicker: false,
        color: "#aabbcc"
    })
    const [fontColor, setFontColor] = useState({
        displayColorPicker: false,
        color: "#aabbcc"
    })
    const [secondaryFontColor, setSecondaryFontColor] = useState({
        displayColorPicker: false,
        color: "#aabbcc"
    })

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.target);
    };

    //background color
    const handleClickPicker = (type) => {
        if (type === "background")
            setBackgroundColor({ ...backGroundColor, displayColorPicker: !backGroundColor.displayColorPicker })
        else if (type === "font")
            setFontColor({ ...backGroundColor, displayColorPicker: !backGroundColor.displayColorPicker })
        else if (type === "sectionLevel")
            setSecondaryFontColor({ ...backGroundColor, displayColorPicker: !backGroundColor.displayColorPicker })

    };

    const handleClosePicker = (type) => {
        if (type === "background")
            setBackgroundColor({ ...backGroundColor, displayColorPicker: false })
        else if (type === "font")
            setFontColor({ ...backGroundColor, displayColorPicker: false })
        else if (type === "sectionLevel")
            setSecondaryFontColor({ ...backGroundColor, displayColorPicker: false })
    };

    const handleChangeBGColor = (color) => {
        debugger
        setBackgroundColor({ ...backGroundColor, color: color.hex })
        let cloneData = JSON.parse(JSON.stringify(data));
        cloneData[currentIndex].sectionStyle.backgroundColor = color.hex;
        setData(cloneData);
        handleSaveBlock();
    };

    const handleChangeSecondaryFontColor = (color) => {
        debugger
        setSecondaryFontColor({ ...backGroundColor, color: color.hex })
        let cloneData = JSON.parse(JSON.stringify(data));
        cloneData[currentIndex].items.map((item, index) => {
            cloneData[currentIndex].items[index].style.color = color.hex;
        })
        setData(cloneData);
        handleSaveBlock();
    };

    const handleChangeFontColor = (color) => {
        debugger
        setFontColor({ ...backGroundColor, color: color.hex })
        let cloneData = JSON.parse(JSON.stringify(data));
        cloneData[currentIndex].items[position]["style"]["color"] = color.hex;
        setData(cloneData);
        console.log('check after Change--->3', cloneData);
        handleSaveBlock();
    };


    const style = reactCSS({
        'default': {
            color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `${backGroundColor.color}`
            },
            fontColor: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `${fontColor.color}`
            },
            swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
                cursor: 'pointer',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    useEffect(() => {
        console.log('check valtio data--->', section_data);
        if (section_data.isEdit) {
            handleSection(section_data.currentSection.sectionIndex);
        } else if (section_data.mode !== '') {
            setMode('view');
            if (section_data.mode === 'delete') handleSectionDelete();
            else if (section_data.mode === 'duplicate') handleSectionDuplicate();
        }
    }, [section_data.currentSection, section_data.mode]);

    const handleSectionDuplicate = () => {
        let cloneData = JSON.parse(JSON.stringify(data));

        let newSection = { ...cloneData[section_data.currentSection.sectionIndex] };
        let index = section_data.currentSection.sectionIndex;
        if (!newSection.isDelete) {
            newSection.isDelete = true;
        }
        cloneData.splice(index + 1, 0, newSection);
        setData(cloneData);
        setReload(!reload);
        console.log('cross check in duplicate----->', cloneData);
        setSnack(true);
        setMessage('Section Cloned successfully');
        // handleSaveBlock();
        section['mode'] = '';
    };

    const handleSectionDelete = () => {
        let index = section_data.currentSection.sectionIndex;

        let cloneData = JSON.parse(JSON.stringify(data));
        console.log('cross check test 1----->', cloneData);
        if (!cloneData[section_data.currentSection.sectionIndex].isDelete) {
            cloneData[index].status = 'InActive';
            if (!inActiveSection.includes(cloneData[section_data.currentSection.sectionIndex].type))
                inActiveSection.push(cloneData[section_data.currentSection.sectionIndex].type);
        } else {
            cloneData.splice(index, 1);
        }
        console.log('cross check test 2----->', cloneData);

        setData(cloneData);
        setReload(!reload);
        setSnack(true);
        setMessage('Section Deleted successfully');
        // handleSaveBlock();
        section['mode'] = '';
    };

    const handleUpdateDeletedSection = (sectionName, index) => {
        let cloneData = data.map((d) => {
            if (sectionName === d.type) {
                inActiveSection.splice(index, 1);
                return { ...d, status: 'Active' };
            } else return { ...d };
        });
        setData(cloneData);
        setReload(!reload);
        setAnchorEl(null);
        handleSaveBlock();
    };
    const onChangeContent = (val, pos, index, type) => {
        console.log('check onchange method--->' + val + '  ' + pos + '  ' + index + '  ' + type);
        setContent(val);
        setCurrentIndex(index);
        setPosition(pos);
        setContentType(type);
        setFontColor({ ...fontColor, color: data[index].items[pos]["style"]["color"] })
    };

    const handleChange = (val) => {
        setContent(val);
        //let cloneData = data;
        let cloneData = JSON.parse(JSON.stringify(data));
        cloneData[currentIndex].items[position].value = val;
        setData(cloneData);
        console.log('check after Change--->3', cloneData);
        handleSaveBlock();
    };

    // const handleChangeColor = (val) => {
    //     debugger
    //     setColor(val);
    //     let cloneData = JSON.parse(JSON.stringify(data));
    //     cloneData[currentIndex].items[position]["style"]["color"] = val;
    //     setData(cloneData);
    //     console.log('check after Change--->3', cloneData);
    //     handleSaveBlock();
    // };

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
    };

    const handleSection = async (index) => {
        let obj = data[index];
        // setCurrentSection(obj);
        setCurrentIndex(index);

        await getFields(obj.items);
        setMode('edit');
        setBackgroundColor({ ...backGroundColor, color: obj.sectionStyle.backgroundColor })
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
        let cloneData = JSON.parse(JSON.stringify(data));
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
                <div className={styles.flex_start}>
                    <div>backGroundColor:</div>
                    <div>
                        <div style={style.swatch} onClick={() => handleClickPicker("background")}>
                            <div style={style.color} />
                        </div>
                        {backGroundColor.displayColorPicker ? <div style={style.popover}>
                            <div style={style.cover} onClick={() => handleClosePicker("background")} />
                            <SketchPicker color={backGroundColor.color} onChange={handleChangeBGColor} />
                        </div> : null}
                    </div>
                </div>
                <div className={styles.flex_start}>
                    <div>Font Color:</div>
                    <div>
                        <div style={style.swatch} onClick={() => handleClickPicker("sectionLevel")}>
                            <div style={style.fontColor} />
                        </div>
                        {secondaryFontColor.displayColorPicker ? <div style={style.popover}>
                            <div style={style.cover} onClick={() => handleClosePicker("sectionLevel")} />
                            <SketchPicker color={secondaryFontColor.color} onChange={handleChangeSecondaryFontColor} />
                        </div> : null}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.left}>
                    <div>
                        <Builder data={data} mode={'view'} onHandleChange={onChangeContent} />
                    </div>
                </div>

                <div className={styles.right}>
                    {mode === 'view' && (
                        <div>
                            <div className={styles.flex_end} style={{ paddingTop: '40px' }}>
                                {inActiveSection.length > 0 && (
                                    <div>
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
                                                return <MenuItem onClick={() => handleUpdateDeletedSection(d, index)}>{d} </MenuItem>;
                                            })}
                                        </Menu>
                                    </div>
                                )}
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
                            {contentType !== 'image' && (<div>
                                <div className={styles.flex_start}>
                                    <div>Font Color:</div>
                                    <div style={style.swatch} onClick={() => handleClickPicker("font")}>
                                        <div style={style.fontColor} />
                                    </div>
                                    {fontColor.displayColorPicker ? <div style={style.popover}>
                                        <div style={style.cover} onClick={() => handleClosePicker("font")} />
                                        <SketchPicker color={fontColor.color} onChange={handleChangeFontColor} />
                                    </div> : null}

                                </div>
                            </div>)}

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
