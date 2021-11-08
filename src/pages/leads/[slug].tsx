import { getLeadPageBySlug, getAllPublishedLeadPages } from '../../service/lead-page.service';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import styles from '../../styles/Blog.module.scss';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import Image from 'next/image';
import Builder from '../../components/Builder'

export async function getStaticProps(context) {
    console.log("Check response data  --->1")
    let lead = await getLeadPageBySlug(context.params.slug);
    return {
        props: { lead }
    };
}

export async function getStaticPaths() {
    let leads = await getAllPublishedLeadPages();

    const paths = leads.map((lead) => ({
        params: { slug: lead.slug.toString() },
    }));
    return { paths, fallback: false };
}

const LeadPage = ({ lead }) => {
    const router = useRouter();
    const [data, setData] = useState(lead.blocks);

    return (
        <div style={{ padding: "2rem" }}>
            <div >
                <Builder data={data} mode={'view'} />
            </div>
        </div>
    );
};
export default LeadPage;
