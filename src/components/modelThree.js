import styles from '../styles/blog-format/format3.module.scss';
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';


const Format3 = ({ blog_format, blogs, categories, data }) => {
    console.log("check data ----->", categories)

    return (
        <>

            <div className={styles.container}>
                <   div className={styles.header}>
                    <div className={styles.secondary_heading}>
                        ATLASSIAN
                        </div>
                    <div className={styles.primary_heading}>
                        WORK LIFE
                        </div>
                    <div>
                        <Link href="#" >{`Product & News ->`}</Link>
                    </div>
                </div>
                <div className={styles.categories}>
                    {/* {categories.map((category, index) => {
                        if (index < 6)
                            return (
                                <div key={index} className={styles.cat_head}>{category.name}</div>
                            )
                    })} */}
                    {data.map(({ category }, index) => {
                        if (index < 6)
                            return (
                                <div key={index} className={styles.cat_head}>{category.name}</div>
                            )
                    })}
                </div>
                <div className={styles.blogs_view}>
                    <div className={styles.border}>
                        <div className={styles.main_blog}>
                            <Image
                                src='https://res.cloudinary.com/sanjayaalam/image/upload/v1636976325/flow1_awvs1s.png'
                                width='785px'
                                height='400px'
                                className={styles.main_img}
                            />
                            <div className={styles.main_content}>
                                <div className={styles.main_title}>The new rules of building business relationships virtually</div>
                                <div className={styles.main_desc}>
                                    To navigate the realities of building rapport in a virtual-first world, remember “the three Rs.”
						</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.sub_content}>
                        {categories.map((cat, index) => {
                            if (index < 4)
                                return (
                                    <div className={styles.sub_category} key={index}>
                                        <Image
                                            src='https://res.cloudinary.com/sanjayaalam/image/upload/v1636980147/cat1_p4e4u9.jpg'
                                            width='100px'
                                            height='100px'
                                            className={styles.main_img}
                                        />
                                        <div className={styles.sub_category_content}>
                                            <div className={styles.category_head}>{cat.name}</div>
                                            <div>5 employee engagement ideas that build authentic connections</div>
                                        </div>
                                    </div>
                                )
                        })}
                    </div>
                </div>
                <div>
                    <div className={styles.heading} style={{ paddingBottom: "20px" }}>LATEST STORIES</div>
                    <div className={styles.blog_list}>
                        {data.map((d, index) => {
                            let { blog, category } = d
                            if (index < 6)
                                return (
                                    <div className={styles._blog_view}>
                                        <Image
                                            src='https://res.cloudinary.com/sanjayaalam/image/upload/v1636981721/blog1_eepo2h.jpg'
                                            className={styles.main_img}
                                            width='425px'
                                            height='300px'></Image>
                                        <div className={styles.blog_heading}>{blog?.title === undefined ? "The new rules of building business relationships virtually" : blog?.title}</div>
                                        <div className={styles.blog_description}>BWork friends are great, but they're not always enough. Here's our prescription for getting targeted professional support.</div>

                                        <div className={styles.blog_footer}>
                                            <div> {`by ${blog?.author === undefined ? "test" : blog?.author}`}</div>
                                            <div>in <span className={styles.category_head}> {category.name}</span></div>
                                        </div>
                                    </div>
                                )
                        })}
                    </div>

                </div>
            </div>

        </>
    );

}

export default Format3;