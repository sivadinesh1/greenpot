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
    const handleEdit = async () => {
        console.log("handle edit method calll----------->")
        let initialData = {
            sectionName: sectionName,
            isEdit: true
        }
        // section.isEdit = true;
        section["currentSection"] = initialData;
        section["isEdit"] = true;
        section["mode"] = ""
    }

    const handleDuplicate = () => {
        let initialData = {
            sectionName: sectionName,
            isEdit: false
        }
        section["currentSection"] = initialData;
        section["mode"] = "duplicate"
        section["isEdit"] = false
    }

    const handleDelete = () => {
        let initialData = {
            sectionName: sectionName,
            isEdit: false
        }
        section["currentSection"] = initialData;
        section["mode"] = "delete"
        section["isEdit"] = false
    }
    return (
        <div className={styles.flex_end}>
            <div className={styles.option} onClick={() => handleEdit()}>
                <EditIcon />
            </div>
            <div className={styles.option} onClick={() => handleDuplicate()}>
                <ContentCopyIcon />
            </div>
            <div className={styles.option}>
                <ArrowDownwardIcon />
            </div>
            <div className={styles.option} style={{ backgroundColor: "rgba(211, 68, 68, 0.979)" }} onClick={() => handleDelete()}>
                <DeleteIcon />
            </div>

        </div>)

}

export default Option;