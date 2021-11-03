import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@material-ui/core';
import { getBlogsByCategory, getBlogsByCompnay } from '../../service/blog.service';
import { getList } from '../../service/company.service';
import useSWR from 'swr';
import Image from 'next/image';
import styles from '../../styles/blog-format/format0.module.scss';
import ModelOne from '../../components/modelOne';
import ModelTwo from '../../components/modelTwo';
import { getByNanoWithAssociation } from '../../service/company.service'

export async function getServerSideProps(context) {
	let company_nano = null;
	let isError = false;
	let company = null;
	let company_id = null;
	let categories = null;
	let blogs = null;
	try {
		company_nano = context.params.company_id;
		let result = await getByNanoWithAssociation(company_nano)
		company = result;
		company_id = company.id;

		//fetch category related blog
		let result3 = await getBlogsByCompnay(company_id);
		blogs = result3;
	} catch (error) {
		console.log('Error Occured in bolg collection', error);
		isError = true;
	}
	return {
		props: { isError, company, categories, blogs },
	};
}

const TestRerender = ({ isError, company, blogs, categories }) => {
	console.log("check company data---->", company)
	return (
		<>
			{company.blog_home_format === 'format-0' && <ModelOne blog_format={company.blog_home_format} blogs={blogs} />}
			{company.blog_home_format === 'format-1' && <ModelTwo blog_format={company.blog_home_format} blogs={blogs} />}
		</>
	);
};

export default TestRerender;
