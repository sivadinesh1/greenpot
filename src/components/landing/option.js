import React, { Fragment, useState } from 'react';
import Image from 'next/image'
import styled from 'styled-components'
import styles from '../../styles/LeadPage.module.scss'
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { section } from "../../utils/section";

const Option = (props) => {
    const { sectionName } = props;
    console.log("check data 12------->", section)
    const handleEdit = async () => {
        console.log("handle edit method calll----------->")
        let request = {
            sectionName: sectionName,
            isEdit: true
        }
        // section.isEdit = true;
        section["currentSection"] = request
    }
    return (
        <div className={styles.flex_end}>
            <div className={styles.option} onClick={() => handleEdit()}>
                <EditIcon />
            </div>
            <div className={styles.option}>
                <ContentCopyIcon />
            </div>
            <div className={styles.option}>
                <ArrowDownwardIcon />
            </div>
            <div className={styles.option}>
                <DeleteIcon />
            </div>

        </div>)

}

export default Option;