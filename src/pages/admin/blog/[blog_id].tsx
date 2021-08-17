import Layout from '../../../components/Layout';

import React, { useState } from 'react';

import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/Category.module.scss';
import BlogList from '../../../components/crud/Blog/blog-list';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import BlogView from '../../../components/crud/Blog/blog-view';

export const getServerSideProps = async (context) => {
	const blog_id = context.params.blog_id as string;

	const cookie = context?.req?.headers.cookie;

	let resp = await axios.get(`${process.env.API_URL}/blog/blogid/${blog_id}`);
	const blog = resp.data;

	return {
		props: { blog },
	};
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
