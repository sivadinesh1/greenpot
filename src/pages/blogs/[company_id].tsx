import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { getBlogsByCategory, getBlogsByCompnay } from '../../service/blog.service';
import { getList } from '../../service/company.service';
import useSWR from 'swr';
import Image from 'next/image';
import styles from '../../styles/blog-format/format0.module.scss';
import ModelOne from '../../components/modelOne'
import ModelTwo from '../../components/modelTwo'


export async function getServerSideProps(context) {
	let company_nano = null;
	let isError = false;
	let company = null;
	let company_id = null;
	let categories = null;
	let blogs = null;
	try {
		company_nano = context.params.company_id;
		//fetch company detail based on nanoid
		let result = await axios.get(`${process.env.API_URL}/company/getByNanoWithAssociation/${company_nano}`);
		company = result.data;
		company_id = company.id;

		//fetch company related categories
		// let result2 = await axios.get(`${process.env.API_URL}/category/${company_id}`);
		// categories = result2.data;

		//fetch category related blog
		let result3 = await getBlogsByCompnay(company_id);
		blogs = result3;
	} catch (error) {
		console.log('Error Occured in bolg collection', error);
		isError = true;
	}
	return {
		props: { isError, company, categories, blogs }
	};
}


const TestRerender = ({ isError, company, blogs, categories }) => {
	return (
		<>
			<div className={styles.container}>
				<br />
				<br />
				<div>Test static page 1</div>
				{company.blog_home_format === 'format-0' && <ModelOne blog_format={company.blog_home_format} blogs={blogs} />}
				{company.blog_home_format === 'format-1' && <ModelTwo blog_format={company.blog_home_format} blogs={blogs} />}
			</div>
		</>
	);
};

export default TestRerender;
