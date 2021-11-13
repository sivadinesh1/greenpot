import { getBySubDomain } from '../../../service/company.service'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import styles from '../../../styles/LeadPage.module.scss'
import { getList } from '../../../service/company.service'
import { getBlogBySlug, getPublishedBlogByCompany } from '../../../service/blog.service.js'
import { jsonToHtml } from '../../../components/utils/EditorJs/conversion'

export async function getStaticProps(context) {
    let company = await getBySubDomain(context.params.slug[0]);
    let blog = await getBlogBySlug(context.params.slug[1]);
    let html = await jsonToHtml(blog.content, blog.layout);
    let response = {};
    if (company) {
        response["blog"] = blog
        response["html"] = html
        response["isError"] = false
        response["message"] = ""
    } else {
        response["isError"] = true
        response["blog"] = blog
        response["html"] = html
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
        let blogs = await getPublishedBlogByCompany(company.id);
        let path = await Promise.all(blogs.map((blog) => ({
            params: { slug: [company.sub_domain, blog.slug.toString()] },
        })))
        paths = [...paths, ...path]
    }))
    return { paths, fallback: false };
}

const Blog = ({ blog, html, isError, message }) => {

    useEffect(() => {
        // The counter changed!
        axios.put(`/api/blog/updateViewCount/${blog.id}`);

    }, [])
    if (isError) {
        return (
            <div className={styles.centered}>
                <div>Something went wrong</div>
            </div>
        )
    } else {
        return (
            <div style={{ padding: "1.5rem" }}>
                <div dangerouslySetInnerHTML={{ __html: html }}></div>
            </div>
        );
    }
};
export default Blog;
