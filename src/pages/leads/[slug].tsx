import { getLeadPageBySlug, getAllPublishedLeadPages } from '../../service/lead-page.service';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styles from '../../styles/LeadPage.module.scss'
import Builder from '../../components/Builder'
import { getBySubDomain } from '../../service/company.service'
import axios from 'axios'

export async function getServerSideProps(context) {
    let host = `test.${context.req.headers.host}`;
    let isDev = host.includes(process.env.NODE_ENV === "development" ? "localhost" : "hashtagwebb");
    let splitHost = host.split(".");
    let subDomain = null;
    let response = {};
    if ((isDev && splitHost.length === 2) || (!isDev && splitHost.length === 3)) {
        subDomain = splitHost[0];
        if (subDomain != null) {
            let company = await getBySubDomain(subDomain)
            let lead = await getLeadPageBySlug(context.params.slug);
            if (company) {
                response["lead"] = lead
                response["isError"] = false
                response["message"] = ""
            } else {
                response["isError"] = true
                response["lead"] = lead
                response["message"] = "SubDomain Not Found"
            }
        }
    }
    return {
        props: { ...response }
    };
}

const LeadPage = ({ lead, isError, message }) => {
    const router = useRouter();
    const [data, setData] = useState(lead.blocks);
    console.log("test router count data--->", router)
    useEffect(() => {
        // The counter changed!
        axios.put(`/api/lead-page/updateViewCount/${lead.id}`);

    }, [])
    if (isError) {
        return (
            <div className={styles.centered}>
                <div>Something went wrong</div>
            </div>
        )
    } else {
        return (
            <div style={{ padding: "2rem" }}>
                <div >
                    <Builder data={data} mode={'view'} />
                </div>
            </div>
        );
    }

};
export default LeadPage;
