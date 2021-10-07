
import { getAllBlogs, getBlogByNanoId } from "../../service/blog.service";
import { useRouter } from 'next/router'
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import styles from "../../styles/Blog.module.scss";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TabletAndroidIcon from '@mui/icons-material/TabletAndroid';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import Meta from '../../components/meta'

export async function getStaticProps(context) {
    // let blogs = await getAllBlogs()
    let blogs = await getBlogByNanoId(context.params.blog_id)
    return {
        props: { blogs },
    }
}

export async function getStaticPaths() {
    let blogs = await getAllBlogs()

    const paths = blogs.map(blog => ({
        params: { blog_id: blog.blog_id.toString() },
    }))
    return { paths, fallback: false }
}

const Blog = ({ blog }) => {
    console.log("check data --->", blog)
    const router = useRouter()
    const { blog_id } = router.query
    const [value, setValue] = React.useState('laptop');

    const handleButton = (data) => {
        console.log("check value --->")
        setValue(data)
    }
    return (
        <div>
            <h1>Todos</h1>

            <Meta title="Test" description="Test meta component" />
            <div className={styles.flex_center}>
                <div><IconButton color="primary" id="mobile" onClick={(event) => handleButton("smartphone")}>
                    <PhoneAndroidIcon />
                </IconButton></div>
                <div><IconButton color="primary" id="tablet" onClick={(event) => handleButton("tablet")}>
                    <TabletAndroidIcon />
                </IconButton></div>
                <div><IconButton color="primary" id="laptop" onClick={(event) => handleButton("laptop")}>
                    <DesktopWindowsIcon />
                </IconButton></div>
            </div>

            <div className={value}>
                <div className='content'>
                    <iframe src={`http://localhost:3000/blog/${blog_id}`} style={{ width: '100%', border: 'none', height: '100%' }} />
                </div>
            </div>
        </div>
    );
}
export default Blog;