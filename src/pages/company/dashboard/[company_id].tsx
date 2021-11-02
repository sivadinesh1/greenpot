import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { getBlogsByCategory, getBlogsByCompnay } from '../../../service/blog.service';
import { getList, getByNanoWithAssociation } from '../../../service/company.service'
import useSWR from 'swr';
import Image from 'next/image';
import styles from '../../../styles/blog-format/format0.module.scss';
import Format from "../../../components/blogFormat/format";
import Format1 from "../../../components/blogFormat/format1";


export async function getStaticProps(context) {
    let company_nano = null;
    let isError = false;
    let company = null;
    let company_id = null;
    let categories = null;
    let blogs = null;
    let videoList = null;
    try {
        company_nano = context.params.company_id;
        //fetch company detail based on nanoid
        // let result = await axios.get(`${process.env.API_URL}/company/getByNanoWithAssociation/${company_nano}`);
        let result = await getByNanoWithAssociation(company_nano)

        company = result;
        company_id = company.id;

        //fetch company related categories
        // let result2 = await axios.get(`${process.env.API_URL}/category/${company_id}`);
        // categories = result2.data;

        //fetch category related blog
        let result3 = await getBlogsByCompnay(company_id);
        blogs = result3;

    } catch (error) {
        console.log('Error Occured in bolg collection', error);
        isError = true;
    }
    return {
        props: { isError, company, categories, blogs, videoList },
    };
}

export async function getStaticPaths() {
    let companies = await getList();

    const paths = companies.map((company) => ({
        params: { company_id: company.company_id.toString() },
    }));
    return { paths, fallback: false };
}

const TemplateOne = ({ isError, company, blogs }) => {

    return (
        <>
            <div className={styles.container}>
                <br />
                <br />
                <div>Test static page</div>
                {company.blog_home_format === "format-0" && <Format blog_format={company.blog_home_format} blogs={blogs} />}
                {company.blog_home_format === "format-1" && <Format1 blog_format={company.blog_home_format} blogs={blogs} />}
            </div>
        </>
    );
};

export default TemplateOne;
