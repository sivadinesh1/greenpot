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
    let objKeys = Object.keys(data);
    console.log("check lead page name------>", data)

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


    const onChangeContent = (val, pos, key) => {
        console.log("check onchange method--->" + val + "  " + pos + "  " + key)
        setContent(val);
        setKey(key);
        setPosition(pos);
        // setData(test)
    }

    const handleChange = (val) => {
        setContent(val);
        let test = data;
        test[key].blocks[position].value = val;
        setData(test)
        console.log("check after Change--->3", test)
    }

    // const hadleSave = async () => {
    //     let request = {
    //         id: collection.id,
    //         block: data
    //     }
    //     let result = await axios.put('/api/lead-page/updateBlock', request)
    //     console.log("check result set--->", result)
    // }

    return (<div>

        <div className={styles.container}>
            <div className={styles.left}>
                <div>
                    <Builder keySet={objKeys} data={data} mode={"view"} onHandleChange={onChangeContent} />
                </div>
            </div>
            <div className={styles.right}>
                <div style={{ paddingTop: "40px" }}>
                    <TextField
                        name="content"
                        type='text'
                        label="Text/Html"
                        margin='dense'
                        variant='standard'
                        size='small'
                        value={content}
                        onChange={(e) => handleChange(e.target.value)}
                        multiline
                        rows={5}
                        fullWidth
                    />

                </div>

                {/* <div>
                    <SectionButton onClick={() => hadleSave()}>Save </SectionButton>
                </div> */}

            </div>
        </div>
    </div>)
}

export default LeadPage;