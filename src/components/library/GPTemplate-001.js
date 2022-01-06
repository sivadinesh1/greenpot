import styles from './../../styles/components/Template1.module.scss'
import React from "react";
import { useEffect, useRef } from 'react'
import { gsap } from "gsap";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';

const Template = () => {
    const left = useRef();
    const right = useRef();
    const rightCorner = useRef();
    const leftCorner = useRef();


    useEffect(() => {
        gsap.from(left.current, {
            duration: 1, ease: "power1.out", y: -500
        });
        gsap.from(right.current, {
            duration: 1, ease: "power1.out", y: 500
        });
        // gsap.to(leftCorner.current, {
        //     x: 180,
        //     delay: 1,
        //     duration: 1
        // });
        // gsap.to(rightCorner.current, {
        //     x: -180,
        //     delay: 2,
        //     duration: 1
        // });

    });

    return (
        <>
            <div className={styles.container}>
                <div className={styles.left} ref={left}>
                    <div className={styles.content}>
                        <div className={styles.title}>Robotics Experts &
Our Automation Team</div>
                        <div className={styles.description}>
                            Vitae auctor eu augue ut. Vel pretium lectus quam id leo. Accumsanlacus vel facilisis volutpat.
                        </div>
                        <div style={{ paddingTop: "20px" }}>
                            <a href="/#" className={styles.link}><span>Explore Now <ArrowForwardOutlinedIcon style={{ paddingTop: "10px" }} /></span></a>
                        </div>
                    </div>

                    <div className={styles.left_corner} ref={rightCorner}>
                        <img src="https://res.cloudinary.com/sanjayaalam/image/upload/v1637326022/play-button_lqy4mb.png" className={styles.play_icon} />
                    </div>

                </div>
                <div className={styles.right} ref={right}>
                    <img
                        src="https://images.unsplash.com/photo-1617777938240-9a1d8e51a47d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1031&q=80"
                        className={styles.image} />
                    <div className={styles.right_corner} ref={rightCorner}>
                        <div>Explore</div>
                        <div className={styles.feature}>Our Feature</div>
                        <a href="#">DownloadDoc</a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Template;