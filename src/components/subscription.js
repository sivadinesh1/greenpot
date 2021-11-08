import { Button } from '@material-ui/core';
import { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import styles from '../styles/Subscription.module.scss'
import styled from 'styled-components';
import Option from "../components/landing/option";
import { useRive, useStateMachineInput } from 'rive-react';
import { motion } from "framer-motion";
import { useCycle } from "framer-motion";
import NextImage from 'next/image';




const Subscription = (props) => {
    let section = 'Subscription';
    const { company_id, lead_id, title, subTitle, key, index, style, mode, logo } = props;
    const [animation, cycleAnimation] = useCycle("animationOne", "animationTwo");

    const handleEvent = (event, position, type) => {
        if (mode === "edit") {
            event.preventDefault();

            const tags = document.querySelectorAll('.clicked');

            for (let i of tags) {
                i.classList.remove('clicked');
            }

            event.target.classList.add('clicked');
            props.onHandle(type === 'image' ? event.target.currentSrc : event.target.childNodes[0].data, position, index, type);
        }
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = async (data) => {
        console.log("test form data----->", data)
    };

    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('')

    const showSuccess = (flag, data) => {
        setMessage(data);
        setIsSuccess(flag);
        setTimeout(() => {
            setIsSuccess(false);
        }, 5000);
    };

    let successStyle = {
        color: 'green',
        content: '⚠ ',
    };

    const GPTitle = styled.div`
                font-size: large;
                font-weight: bold;
                padding-bottom: 1rem;
                white-space: pre-line;

                ${mode === 'edit'
            ? `&:hover {
                outline-style: solid;
                outline-color: #0000ff;
            }`
            : ''}
            `;

    const GPSubTitle = styled.div`
            font-size: medium;
            padding-bottom: 1rem;
            white-space: pre-line;

            ${mode === 'edit'
            ? `&:hover {
            outline-style: solid;
            outline-color: #0000ff;
            }`
            : ''}
            `;


    const GPBox = styled.div`
    position: relative;
    padding-top: 150px;
    padding-right: 200px;`;


    const BannerVariants = {
        animationOne: { x: -250, opacity: 1, transition: { duration: 0.5 } },
        animationTwo: {
            y: [0, -20],
            opacity: 1,
            transition: { yoyo: Infinity, ease: "easeIn" }
        }
    };

    const STATE_MACHINE_NAME = 'State Machine 1';


    const { RiveComponent, rive } = useRive({
        src: './../../../logistic_box.riv',
        stateMachines: STATE_MACHINE_NAME,
        artboard: 'New Artboard',
        autoplay: true,
    });

    return (
        <div className={styles.imageStack}>
            <div className={styles.subcontainer}>
                <div style={{ paddingLeft: '15px', paddingTop: '20px' }}>
                    <div onClick={(event) => handleEvent(event, 2, 'image')}>
                        <NextImage src={logo} height='50px' width='50px' />
                    </div>
                </div>
                <div className={styles.rive}>
                    <RiveComponent />
                </div>
            </div>
            <GPBox>&nbsp;</GPBox>
            <GPBox>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <motion.h1
                        initial={{ y: -1000 }}
                        animate={{ y: 0 }}
                        transition={{
                            type: "tween",
                            duration: "1",
                            delay: "1"
                        }}
                    >
                        <GPTitle style={title.style}>
                            <span onClick={(event) => handleEvent(event, 0, "text")}>{title.value}</span>
                        </GPTitle>
                    </motion.h1>

                    <GPSubTitle style={subTitle.style}>
                        <span onClick={(event) => handleEvent(event, 1, "text")}>{subTitle.value}</span> </GPSubTitle>


                    <div className={styles.form_gap}>
                        <TextField type='email' label='Email Address' variant="outlined" margin='dense' name='email' style={{ width: '100%' }} autoComplete='off' {...register('email')} />
                    </div>
                    {isSuccess && <p style={successStyle}>{message}</p>}
                    <div className={styles.form_gap}>
                        <Button type='submit' variant="contained" color='primary' style={{ width: '100%' }}>
                            Join us!
						</Button>
                    </div>
                    <div className={styles.helper_text}>{`We don't share email with anyone`}</div>
                </form>
            </GPBox>
        </div>

    )

}

export default Subscription;
