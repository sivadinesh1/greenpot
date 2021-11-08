import { getBlogBySlug, getAllPublishedBlog } from '../../service/blog.service';
import React, { useState } from 'react';

import { jsonToHtml } from '../../components/utils/EditorJs/conversion'


export async function getStaticProps(context) {
    let blog = await getBlogBySlug(context.params.slug);
    let html = await jsonToHtml(blog.content, blog.layout);
    return {
        props: { blog, html },
    };
}

export async function getStaticPaths() {
    let blogs = await getAllPublishedBlog();

    const paths = blogs.map((blog) => ({
        params: { slug: blog.slug.toString() },
    }));
    return { paths, fallback: false };
}

const Blog = ({ blog, html }) => {
    return (
        <div style={{ padding: "1.5rem" }}>
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    );
};
export default Blog;
