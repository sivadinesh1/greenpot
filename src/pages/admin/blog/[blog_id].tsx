import Layout from '../../../components/Layout';

import React, { useState } from 'react';

import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/Category.module.scss';
import BlogList from '../../../components/crud/Blog/blog-list';
import { getAllBlogs, getBlogById } from '../../api/blog/[...crud]';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import BlogView from '../../../components/crud/Blog/blog-view';

export const getServerSideProps = async (context) => {
	const blog_id = context.params.blog_id as string;

	// both works dont delete
	//const categorys = await getAllCategories(company_id);
	let blog = [];

	try {
		const cookie = context?.req?.headers.cookie;

		let resp = await axios.get(`${process.env.API_URL}/blog/crud/${blog_id}`, {
			headers: {
				cookie: cookie!,
			},
		});
		blog = resp.data;
		return {
			props: { blog },
		};
	} catch (error) {
		console.log('dineh error' + error.response.status);
		if (error.response.status === 401) {
			return {
				redirect: {
					permanent: false,
					destination: '/',
				},
			};
		}
	}
};

export default function Index({ blog }) {
	return (
		<>
			<div className={styles.cat_wrap}>
				<div className={styles.left}></div>

				<div className={styles.right}>
					<BlogView blog={blog} />
				</div>
			</div>
		</>
	);
}
