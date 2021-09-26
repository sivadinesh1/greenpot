import Layout from '../../../components/Layout';

import React, { useState, useEffect } from 'react';

import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../model/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/Category.module.scss';
import BlogList from '../../../components/crud/Blog/blog-list';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import BlogView from '../../../components/crud/Blog/blog-view';
import { forceLogout } from '../../../components/auth/auth';

export const getServerSideProps = async (context) => {
	const blog_id = context.params.blog_id as string;
	let isError = false;
	let cookie = null;
	let blog = null;
	try {
		cookie = context?.req?.headers.cookie;
		let resp = await axios.get(`${process.env.API_URL}/blog/blogByNano/${blog_id}`);
		blog = resp.data;
	} catch (error) {
		console.log(`error in blog view ${error}`);
		isError = true;
	}
	return {
		props: { isError, blog },
	};
};

export default function Index({ isError, blog }) {
	useEffect(() => {
		if (isError) {
			return forceLogout();
		}
	}, []);
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
