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

export default function Index({ blog, company_id }) {
	return (
		<>
			<div className={styles.cat_wrap}>
				<div className={styles.left}></div>

				<div className={styles.right}>
					<BlogView blog={blog} company_id={company_id} />
				</div>
			</div>
		</>
	);
}

// Step 2: during build every id will get called and page gets cached
export const getStaticProps = async (ctx) => {
	const blog_id = ctx.params.blog_id as string;
	const blog = await getBlogById(blog_id);
	let company_id = ctx.req ? { cookie: ctx.req.headers.cookie } : undefined;

	if (ctx.req) {
		console.log('SSR cookie ' + ctx.req.headers.cookie);
		console.log('SSR cookie@ ' + JSON.stringify(ctx.req.headers.cookie));
	}

	return {
		props: { blog, company_id },
	};
};

// Step1: first static props gets all data
export const getStaticPaths = async () => {
	const blogs = await getAllBlogs();
	const paths = blogs.map((a) => {
		return { params: { blog_id: a.id.toString() } };
	});

	return {
		fallback: false,
		paths,
	};
};

// export async function getInitialProps(context) {
// 	const company_id = context.params.company_id as string;
// 	const blog_id = context.params.company_id as string;

// 	const [categoriesRes, tagsRes] = await Promise.all([
// 		axios(`/api/category/crud/company/${company_id}`),
// 		axios(`/api/category/crud/company/${company_id}`),
// 	]);
// 	const [categories, tags] = await Promise.all([categoriesRes, tagsRes]);
// 	return { props: { categories, tags } };
// }
