import { getLeadPageBySlug, getPublishedLeadPagesByCompany } from '../../../service/lead-page.service';
import { getBySubDomain } from '../../../service/company.service'
import React, { useState } from 'react';
import Builder from '../../../components/Builder'
import styles from '../../../styles/LeadPage.module.scss'
import { getList } from '../../../service/company.service'

export async function getStaticProps(context) {
    let company = await getBySubDomain(context.params.slug[0])
    let lead = await getLeadPageBySlug(context.params.slug[1]);
    let response = {};
    if (company) {
        response["lead"] = lead
        response["isError"] = false
        response["message"] = ""
    } else {
        response["isError"] = true
        response["lead"] = lead
        response["message"] = "SubDomain Not Found"
    }
    return {
        props: { ...response }
    };
}

export async function getStaticPaths() {
    let companies = await getList();
    let paths = [];
    await Promise.all(companies.map(async (company) => {
        let leads = await getPublishedLeadPagesByCompany(company.id);
        let path = await Promise.all(leads.map((lead) => ({
            params: { slug: [company.sub_domain, lead.slug.toString()] },
        })))
        paths = [...paths, ...path]
    }))
    return { paths, fallback: false };
}

const LeadPage = ({ lead, isError, message }) => {
    const [data, setData] = useState(lead.blocks);
    if (isError) {
        return (
            <div className={styles.centered}>
                <div>Something went wrong</div>
            </div>
        )
    } else {
        return (
            <div style={{ padding: "5rem" }}>
                <div style={{ textAlign: "center" }} >
                    <Builder data={data} mode={'view'} />
                </div>
            </div>
        );
    }

};
export default LeadPage;
