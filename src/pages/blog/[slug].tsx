import { getBlogBySlug, getAllPublishedBlog } from '../../service/blog.service';
import React, { useState, useEffect } from 'react';
import styles from '../../styles/Blog.module.scss'
import { jsonToHtml } from '../../components/utils/EditorJs/conversion'
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
            let blog = await getBlogBySlug(context.params.slug);
            let html = await jsonToHtml(blog.content, blog.layout);
            if (company) {
                response["blog"] = blog
                response["isError"] = false
                response["html"] = html
                response["message"] = ""
            } else {
                response["isError"] = true
                response["blog"] = blog
                response["html"] = html
                response["message"] = "SubDomain Not Found"
            }
        }
    }
    return {
        props: { ...response }
    };
}

const Blog = ({ blog, html, isError, message }) => {

    useEffect(() => {
        // The counter changed!
        let values = {
            id: blog.id,
            count: blog.view_count + 1
        }
        axios.put(`/api/blog/updateViewCount`, values);

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
