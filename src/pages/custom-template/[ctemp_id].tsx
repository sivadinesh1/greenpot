import React, { useState, useEffect } from 'react';
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
import Footer from "../../components/Footer";
import { useForm, Controller } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


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
    const [objKeys, setObjKeys] = useState(Object.keys(data));
    const [currentSection, setCurrentSection] = useState();
    const [fields, setFields] = useState([]);
    const [mode, setMode] = useState("view");
    const [currentKey, setCurrentKey] = useState();

    let initialVal={};

    const handleMode = (mode) =>{
        setMode(mode)
    }
    
    const getFields= (content)=>{
        fields.length=0
        content.map((data)=> {
            fields.push(data.formDetail)
            initialVal[data.formDetail.name]=data.value
        })
      
    }

    const handleSection = (key) => {
        setCurrentKey(key);
        let obj = data[key];
        getFields(obj.content);
        setCurrentSection(obj);
        handleMode("edit");
        console.log("test scetion data", currentSection)
    }

     // use form edit 
            // const { initialValues } = formConfig;
            // { defaultValues: initialValues }

            const {
                control,
                setValue,
                handleSubmit,
                watch,
                formState: { errors },
            } = useForm({ defaultValues: initialVal });

           const  onSubmit= async (formData) => {
                console.log("form submit data test ---->",formData);
            }
            console.log("test watch data--->",watch('company'))
            console.log("test watch data--->",watch('content'))

            const updateCurrentSection =()=>{
                currentSection.content[0].value=watch(fields[0].name)
            }

    const edit =() =>{
        switch (currentKey) {
            case 'Header':
                if (currentSection.status === 'Active')
                    return (<Header content={watch('content',currentSection.content[1].value)} company={watch('company',currentSection.content[0].value)} />)
            case 'Footer':
                if (currentSection.status === 'Active')
                    return (<Footer data={currentSection.content} />)
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
                    {/* <vr style={{ background: '#000000' }} /> */}
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
							})}
                            </form>
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
                                    // return (<Header data={obj.content} />)
                                    return (<Header company={obj.content[0].value} content={obj.content[1].value}/>)
                            case 'Footer':
                                obj = data['Footer']
                                if (obj.status === 'Active')
                                    return (<Footer data={obj.content} />)

                        }
                    })}

                    {mode === "edit" && edit()}
                </div>
            </div>
            {/* style Layer */}
            <div className={styles.right}>

            </div>
        </div>
    </>)

}

export default CustomTemp;