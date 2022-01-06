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
import ModelThree from '../../components/modelThree'
import { getByNanoWithAssociation } from '../../service/company.service'
import { getCategoriesByCompany, getlatestCategoryWithBlog } from '../../service/category.service'

export async function getServerSideProps(context) {
	let company_nano = null;
	let isError = false;
	let company = null;
	let company_id = null;
	let categories = null;
	let blogs = null;
	let data = null;
	try {
		company_nano = context.params.company_id;
		let result = await getByNanoWithAssociation(company_nano)
		company = result;
		company_id = company.id;

		//fetch category related blog
		let result3 = await getBlogsByCompnay(company_id);

		//fetch category by company 
		categories = await getCategoriesByCompany(company_id)

		//check data 
		data = await getlatestCategoryWithBlog(company_id)
		blogs = result3;
	} catch (error) {
		console.log('Error Occured in bolg collection', error);
		isError = true;
	}
	return {
		props: { isError, company, categories, blogs, data },
	};
}

const TestRerender = ({ isError, company, blogs, categories, data }) => {
	console.log("check company data---->", company)
	return (
		<>
			{company.blog_home_format === 'format-0' && <ModelOne blog_format={company.blog_home_format} blogs={blogs} />}
			{company.blog_home_format === 'format-1' && <ModelTwo blog_format={company.blog_home_format} blogs={blogs} />}
			{company.blog_home_format === 'format-2' && <ModelThree blog_format={company.blog_home_format} data={data} categories={categories} blogs={blogs} />}
		</>
	);
};

export default TestRerender;
