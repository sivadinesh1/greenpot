import styles from "../../styles/blog-format/format0.module.scss";

import Image from 'next/image';

const Format = ({ blog_format, blogs }) => {
    console.log("check data in component--->", blog_format)
    console.log("check data in component--->2", blogs)
    // let styles = null;
    // if (blog_format === "format-0")
    //     styles = styles0
    // if (blog_format === "format-1")
    //     styles = styles1
    // if (blog_format === "format-2")
    //     styles = styles1
    return (
        // <div className={blog_format === "format-0" ? styles0.container : styles1.container}>
        <div className={styles.container}>

            <div>{blog_format}</div>

            <div className={styles.list}>
                {!blogs.length && <div>No Blogs created</div>}
                {blogs.length > 0 &&
                    blogs?.map((item, index) => {
                        return (
                            <div key={index} className={styles.list_blogs}>
                                <div className={styles.thumbnail}>
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
    )
}

export default Format;