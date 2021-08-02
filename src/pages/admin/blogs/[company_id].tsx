import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import React, { useState } from 'react';
import { getCompany } from '../../../components/auth/auth';
import SnackBar from '../../../components/elements/ui/Dialog/SnackBar';

import { Blog } from '../../../modal/Blog';
import { GetStaticPaths, GetStaticProps } from 'next';

import styles from '../../../styles/Category.module.scss';

import BlogList from '../../../components/crud/Blog/blog-list';
import { getAllBlogs, getBlogsByCompany } from '../../api/blog/[...crud]';
import BlogAdd from '../../../components/crud/Blog/blog-add';

import axios from 'axios';
import useSWR, { mutate, trigger } from 'swr';
import { Button } from '@material-ui/core';
import Link from 'next/link';

export const getServerSideProps = async (context) => {
	const company_id = context.params.company_id as string;
	const blogs = await getBlogsByCompany(company_id);
	return {
		props: { blogs, company_id },
	};
};

export interface BlogProps {
	blogs: Blog[];
	company_id: string;
}

export default function Index({ blogs, company_id }: BlogProps) {
	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState('');
	const [mode, setMode] = useState('list');

	const { data: result } = useSWR(`/api/blog/crud/company/${company_id}`, { initialData: blogs, revalidateOnMount: true });

	let blogsList: Blog[] = result;

	const handleSnackOpen = (message) => {
		setSnack(true);
		setMessage(message);
	};

	const reloadBlogList = async () => {
		mutate(`/api/blog/crud/company/${company_id}`);
		await axios.get(`/api/blog/crud/company/${company_id}`);
		trigger(`/api/blog/crud/company/${company_id}`);
	};

	const chooseMode = (mode: string) => {
		setMode(mode);
	};

	return (
		<Layout>
			<Admin>
				<div className={styles.cat_wrap}>
					<div className={styles.left}>
						<div className={styles.blogAdd}>
							<Link href={`/admin/blog-add/${company_id}`}>
								<a>+ Add Blog</a>
							</Link>
						</div>
					</div>

					<div className={styles.right}>
						{mode === 'list' && (
							<BlogList blogs={blogsList} onReloadBlogList={reloadBlogList} handleSnackOpen={handleSnackOpen} onMode={chooseMode} />
						)}
						{mode === 'add' && <BlogAdd onMode={chooseMode} blogs={blogsList} handleSnackOpen={handleSnackOpen} onReloadBlogList={reloadBlogList} />}
					</div>
				</div>
			</Admin>
			<SnackBar open={snack} handleClose={() => setSnack(false)} message={message}></SnackBar>
		</Layout>
	);
}
