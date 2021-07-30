import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import React, { useState } from 'react';
import { getCompany } from '../../../components/auth/auth';
import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../../styles/Category.module.scss';
import BlogList from '../../../components/crud/Blog/blog-list';
import { getAllBlogs, getBlogById } from '../../api/blog/[...crud]';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import BlogView from '../../../components/crud/Blog/blog-view';

export interface BlogProps {
	blog: Blog;
}

export default function Index({ blog }: BlogProps) {
	return (
		<Layout>
			<Admin>
				<div className={styles.cat_wrap}>
					<div className={styles.left}></div>

					<div className={styles.right}>
						<BlogView blog={blog[0]} />
					</div>
				</div>
			</Admin>
		</Layout>
	);
}

// Step 2: during build every id will get called and page gets cached
export const getStaticProps = async (ctx) => {
	const blog_id = ctx.params.blog_id as string;
	const blog = await getBlogById(blog_id);
	return {
		props: { blog },
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
