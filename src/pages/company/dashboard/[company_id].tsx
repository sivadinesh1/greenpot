import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { getBlogsByCategory } from "../../../service/blog.service";
import useSWR from 'swr';
import Image from 'next/image';
import styles from '../../../styles/blog-format/format0.module.scss'

export const getServerSideProps = async (context) => {
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
        let result = await axios.get(`${process.env.API_URL}/company/getByNano/${company_nano}`)
        company = result.data;
        console.log("check one --->", company)
        company_id = company.id

        //fetch com pany related categories
        let result2 = await axios.get(`${process.env.API_URL}/category/${company_id}`)
        categories = result2.data;

        //fetch category related blog
        let result3 = await getBlogsByCategory(categories[0].id)
        blogs = result3;


    } catch (error) {
        console.log("Error Occured in bolg collection", error)
        isError = true;
    }
    return {
        props: { isError, company, categories, blogs, videoList },
    };
}

const TemplateOne = ({ isError, company, categories, blogs }) => {
    const [selectedCategory, setSelectedCategory] = useState(categories ? categories[0] : null);
    const {
        data: blogarr,
        mutate,
        error,
    } = useSWR(`/api/blog/category/${selectedCategory?.id}`, {
        initialData: blogs,
    });
    const handleCategory = (category) => {
        console.log("check on click---->", category.name)
        setSelectedCategory(category)
        mutate();
    }

    return (<>
        <div className={styles.container}>
            <br />
            <div className={styles.title}> Squaple</div>
            <div >Create a Tumblr-style blog using Jekyll! Tumble comes with post types, a simply beautiful design, and lots of customization options.</div>
            <div className={styles.cat_list}>
                {categories?.map((category, index) => {

                    return (
                        <div style={{ cursor: "pointer" }} onClick={() => handleCategory(category)} key={index}>
                            {category.name}
                        </div>
                    )
                })

                }
            </div>
            <div className={styles.list}>
                {!blogarr.length && <div>No Blogs created</div>}
                {blogarr.length > 0 &&
                    blogarr?.map((item, index) => {
                        return (
                            <div key={index} className={styles.list_blogs}>

                                <div className={styles.thumbnail} >
                                    <Image src={item.thumbnail} height='155px' width='180px' />
                                    <div>{item.title}</div>
                                </div>
                                <div className={styles.footer}>
                                    <div>{item.name}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>

    </>)
}


export default TemplateOne;