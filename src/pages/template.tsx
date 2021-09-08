import axios from 'axios';
import styles from '../styles/Template.module.scss'
import Image from 'next/image';
import Router from 'next/router';
import { TextField, FormControl, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import Divider from '@material-ui/core/Divider';




const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '100%',
    },
}));

export const getServerSideProps = async (context) => {
    let isError = false;
    const cookie = context?.req?.headers.cookie;
    let templates = null;
    try {
        //fetch templates
        let result2 = await axios.get(`${process.env.API_URL}/template`, {
            headers: {
                cookie: cookie!,
            },
        });
        templates = result2.data;
    } catch (error) {
        console.log(`error in template ${error}`);
        isError = true;
    }

    return {
        props: { isError, templates },
    };
};

const ListTemplate = ({ templates }) => {
    const classes = useStyles();

    return (
        <>
            <div className={styles.temp_wrap}>
                <div className={styles.left}>
                    <div style={{ marginTop: '20px' }} >Lead Capture - Template gallery </div>
                    <div style={{ marginTop: '20px' }}>Use templates to quickly get started. Modern
SEO ready templates for better conversion.</div>
                </div>

                <div className={styles.right}>

                    <div className={styles.dialog_pop} style={{ marginTop: '40px' }}>
                        <div style={{ fontSize: '20px' }}>&emsp;</div>
                        <div style={{ cursor: 'pointer', marginRight: '10px' }} onClick={(event) => Router.back()}>Back</div>
                    </div>

                    <div className={styles.search}>
                        <FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
                            <Input
                                type='text'
                                placeholder='Search for a template'
                                fullWidth
                                margin='dense'
                                name='search'
                                startAdornment={
                                    <InputAdornment position='start'>
                                        <IconButton aria-label='toggle password visibility'  >
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                } />
                        </FormControl>
                    </div>

                    <div className={styles.title}>
                        <div>Lead capture</div>
                        <div style={{ marginTop: '5px' }}><Divider /></div>
                    </div>

                    <div className={styles.body}>
                        {templates.map((temp,index)=>{
                            return(
                                <div key={index} className={styles.list_temp}>
                                        <div className={styles.temp_image} >
                                        
                                        </div>
                                        <div className={styles.temp_title}>

                                        {temp.name}
                                        </div>
                             </div>
                            )
                        })}

                    </div>


                </div>
            </div>
        </>);
}

export default ListTemplate;