import { getLeadPageByNano, getAllPublishedLeadPages } from '../../../service/lead-page.service';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import styles from '../../../styles/Blog.module.scss';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import Image from 'next/image';

export async function getStaticProps(context) {
    let leads = await getLeadPageByNano(context.params.lead_page_id);
    return {
        props: { leads },
    };
} 0

export async function getStaticPaths() {
    let leads = await getAllPublishedLeadPages();

    const paths = leads.map((lead) => ({
        params: { lead_page_id: lead.lead_page_id.toString() },
    }));
    return { paths, fallback: false };
}

const LeadPage = ({ leads }) => {
    const router = useRouter();
    const { lead_page_id } = router.query;
    const [value, setValue] = React.useState('laptop');

    const handleButton = (data) => {
        console.log('check value --->');
        setValue(data);
    };

    return (
        <div className={styles.preview_wrap}>
            <div style={{ paddingLeft: '1rem', cursor: 'pointer' }} onClick={() => router.back()}>
                <span>
                    <Image src='/static/images/back.svg' alt='edit' width='24px' height='24px' />
                </span>
                <span style={{ top: '-5px', position: 'relative' }}>Back</span>
            </div>
            <div className={styles.flex_center}>
                <div style={{ padding: '0 0.3rem' }}>
                    <IconButton color='primary' id='mobile' onClick={(event) => handleButton('smartphone')}>
                        <PhoneAndroidIcon />
                    </IconButton>
                </div>
                <div style={{ padding: '0 0.3rem' }}>
                    <IconButton color='primary' id='tablet' onClick={(event) => handleButton('tablet')}>
                        <TabletAndroidIcon />
                    </IconButton>
                </div>
                <div style={{ padding: '0 0.3rem' }}>
                    <IconButton color='primary' id='laptop' onClick={(event) => handleButton('laptop')}>
                        <DesktopWindowsIcon />
                    </IconButton>
                </div>
            </div>

            <div className={value}>
                <div className='content'>

                    <iframe src={`${process.env.CLIENT_URL}/lead-page/${lead_page_id}`} style={{ width: '100%', border: 'none', height: '100%' }} />
                </div>
            </div>
        </div>
    );
};
export default LeadPage;
